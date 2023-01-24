import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
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
  @UseGuards(AuthGuard)
  public tokenInfo(@TokenPayload() payload?: JWTPayload) {
    return payload;
  }
}
