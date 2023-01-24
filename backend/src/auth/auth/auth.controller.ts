import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, Observable } from 'rxjs';
import { ErrorResponse } from '../forty-two/error.response';
import { FortyTwoService } from '../forty-two/forty-two.service';
import { TokenResponse } from '../forty-two/token.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly fortyTwoService: FortyTwoService) {}

  @Get('authorize')
  public authorize(@Res() res: Response, @Query('state') state?: string) {
    res.redirect(this.fortyTwoService.getAuthorizeUrl(state));
  }

  @Get('callback')
  public callback(
    @Query('code') code: string,
    @Query('state') state?: string,
  ): Observable<TokenResponse> {
    return this.fortyTwoService.getTokenWithAuthorizationCode(code, state).pipe(
      catchError((error: ErrorResponse) => {
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
      }),
    );
  }

  @Get('token/info')
  public tokenInfo(@Query('token') token: string) {
    return this.fortyTwoService.getTokenInfo(token).pipe(
      catchError((error: ErrorResponse) => {
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
      }),
    );
  }

  @Get('user/info')
  public userInfo(@Query('token') token: string) {
    return this.fortyTwoService.getUserInfo(token).pipe(
      catchError((error: ErrorResponse) => {
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
      }),
    );
  }
}
