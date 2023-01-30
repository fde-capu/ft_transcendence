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
import { ErrorFortyTwoApi } from 'src/forty-two/service/error';
import { TokenFortyTwoApi } from 'src/forty-two/service/token';
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
    let fortyTwo: TokenFortyTwoApi;
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
            mfa: { enabled: true, verified: false },
            fortyTwo,
          }),
        ),
        catchError((error: ErrorFortyTwoApi) => {
          throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }),
      ),
    );
    // Code review note (CRN):
    // - The multiplyer 1000 (exp) could be ad option set in a global object.
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
      .json({ message: 'Did you have a good trip?' });
  }
  // CRN: All strings could also be in a separate global.

  @Get('info')
  public tokenInfo(@TokenPayload() payload?: JWTPayload) {
    if (!payload) throw new UnauthorizedException();
    return { sub: payload.sub, exp: payload.exp, mfa: payload['mfa'] };
  }

  @Get('challenge')
  public enableChallenge(@TokenPayload() payload?: JWTPayload) {
    if (!payload) throw new UnauthorizedException();

    if (payload['mfa']['enabled']) throw new BadRequestException();

    const secret = 'LMWVYBAAAVES2FKG'; // CRN: What's this, why is it here?
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

    const secret = 'LMWVYBAAAVES2FKG'; // CRN: TODO: keep secret actually secret.
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
  // CRN: Here the multiplyer 1000 is also used.

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
    // CRN: Also * 1000.
  }
}
