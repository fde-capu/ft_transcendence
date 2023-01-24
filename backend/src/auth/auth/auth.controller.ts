import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ErrorResponse } from '../forty-two/error.response';
import { FortyTwoService } from '../forty-two/forty-two.service';
import { TokenService } from '../token/token.service';

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
    @Query('code') code: string,
    @Query('state') state?: string,
  ): Promise<Response<any, Record<string, any>>> {
    let expireIn = 0;
    const token = await firstValueFrom(
      this.fortyTwoService.getTokenWithAuthorizationCode(code, state).pipe(
        tap((r) => {
          expireIn = r.expires_in;
        }),
        switchMap((r) => this.fortyTwoService.getUserInfo(r.access_token)),
        switchMap((r) => this.tokenService.sign(r.login, expireIn)),
        catchError((error: ErrorResponse) => {
          throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }),
      ),
    );
    return res
      .cookie('authorization', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: expireIn * 1000,
      })
      .json({ access_token: token });
  }

  @Get('info')
  public tokenInfo(@Req() req: Request) {
    const token = req.cookies['authorization'];
    if (token) return this.tokenService.inspect(token);
    return { error: 'token vazio!' };
  }
}
