import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JWTPayload } from 'jose';
import { catchError, firstValueFrom, switchMap, tap } from 'rxjs';
import { TokenPayload } from '../decorator/token-payload.decorator';
import { TokenService } from '../service/token.service';
import { AuthGuard } from '../guard/auth.guard';
import { FortyTwoService } from 'src/forty-two/service/forty-two.service';
import { ErrorResponse } from 'src/forty-two/service/error.response';
import { TokenResponse } from 'src/forty-two/service/token.response';
import { encode } from 'querystring';
import { OtpService } from '../service/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fortyTwoService: FortyTwoService,
    private readonly tokenService: TokenService,
    private readonly otp: OtpService,
  ) {}

  @Get('authorize')
  public authorize(@Res() res: Response, @Query('state') state?: string) {
    res.redirect(this.fortyTwoService.getAuthorizeUrl(state));
  }

  @Get('callback')
  public async callback(
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string,
  ) {
    if (error) {
      const query = encode({
        cause: error,
        description: errorDescription,
      });
      res
        .clearCookie('authorization')
        .redirect(`http://localhost:4200/error?${query}`);
      return;
    }
    let fortyTwo: TokenResponse;
    let expiresIn = 0;
    const token = await firstValueFrom(
      this.fortyTwoService.getTokenWithAuthorizationCode(code, state).pipe(
        tap((r) => {
          expiresIn = r.expires_in;
          fortyTwo = r;
        }),
        switchMap((r) => this.fortyTwoService.getUserInfo(r.access_token)),
        switchMap((r) =>
          this.tokenService.sign({
            sub: r.login,
            exp: Math.floor(Date.now() / 1000) + expiresIn,
            mfa: { enabled: false, verified: false },
            fortyTwo,
          }),
        ),
        catchError((error: ErrorResponse) => {
          throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }),
      ),
    );
    return res
      .cookie('authorization', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: expiresIn * 1000,
      })
      .redirect('http://localhost:4200/login');
  }

  @Get('logout')
  public logout(@Res() res: Response) {
    return res
      .clearCookie('authorization')
      .json({ message: 'We hope see u soon' });
  }

  @Get('info')
  @UseGuards(AuthGuard)
  public tokenInfo(@TokenPayload() payload?: JWTPayload) {
    return { sub: payload.sub, exp: payload.exp, mfa: payload['mfa'] };
  }

  @Get('challenge')
  public enableChallenge(@TokenPayload() payload?: JWTPayload) {
    if (!payload) throw new UnauthorizedException();

    if (payload['mfa']['enabled']) throw new BadRequestException();

    const secret = 'LMWVYBAAAVES2FKG';
    return {
      secret,
      uri: this.otp.getUri(payload.sub, secret),
    };
  }

  @Post('challenge')
  public async verifyChallenge(
    @Res() res: Response,
    @Body() body: { token: string },
    @TokenPayload() payload?: JWTPayload,
  ) {
    const { token: otp } = body;

    if (!payload) throw new UnauthorizedException();

    if (!otp) throw new BadRequestException();

    const secret = 'LMWVYBAAAVES2FKG';
    const valid = this.otp.verify(otp, secret);
    if (!valid) throw new BadRequestException();

    const token = await this.tokenService.sign({
      ...payload,
      mfa: { enabled: true, verified: true },
    });
    return res
      .cookie('authorization', token, {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(payload.exp * 1000),
      })
      .json({
        sub: payload.sub,
        exp: payload.exp,
        mfa: { enabled: true, verified: true },
      });
  }

  @Delete('challenge')
  @UseGuards(AuthGuard)
  public async disableChallenge(
    @Res() res: Response,
    @TokenPayload() payload?: JWTPayload,
  ) {
    const token = await this.tokenService.sign({
      ...payload,
      mfa: { enabled: false, verified: false },
    });

    return res
      .cookie('authorization', token, {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(payload.exp * 1000),
      })
      .json({
        sub: payload.sub,
        exp: payload.exp,
        mfa: { enabled: false, verified: false },
      });
  }
}
