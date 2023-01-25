import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fortyTwoService: FortyTwoService,
    private readonly tokenService: TokenService,
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
    let expireIn = 0;
    const token = await firstValueFrom(
      this.fortyTwoService.getTokenWithAuthorizationCode(code, state).pipe(
        tap((r) => {
          expireIn = r.expires_in;
          fortyTwo = r;
        }),
        switchMap((r) => this.fortyTwoService.getUserInfo(r.access_token)),
        switchMap((r) =>
          this.tokenService.sign(r.login, expireIn, { fortyTwo }),
        ),
        catchError((error: ErrorResponse) => {
          throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }),
      ),
    );
    res
      .cookie('authorization', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: expireIn * 1000,
      })
      .redirect('http://localhost:4200/login');
  }

  @Get('logout')
  public logout(@Res() res: Response) {
    res.clearCookie('authorization').json({ message: 'We hope see u soon' });
  }

  @Get('info')
  @UseGuards(AuthGuard)
  public tokenInfo(@TokenPayload() payload?: JWTPayload) {
    return payload;
  }
}
