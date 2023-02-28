import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { catchError, firstValueFrom, map, switchMap, tap } from 'rxjs';
import { ErrorFortyTwoApi } from 'src/forty-two/service/error';
import { FortyTwoService } from 'src/forty-two/service/forty-two.service';
import { TokenFortyTwoApi } from 'src/forty-two/service/token';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { encode } from 'querystring';
import { JWTPayload } from 'jose';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  private readonly thousand = 1000;

  private frontendOrigin: string;

  constructor(
    private readonly fortyTwoService: FortyTwoService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly otp: OtpService,
    readonly configService: ConfigService,
  ) {
    this.frontendOrigin = this.configService.get<string>('FRONTEND_ORIGIN');
  }

  public redirectToAuthorizeEndpoint(response: Response, state?: string) {
    response.redirect(this.fortyTwoService.getAuthorizeUrl(state));
  }

  public redirectToTheErrorPage(
    response: Response,
    error: string,
    errorDescription?: string,
  ) {
    const query = encode({
      cause: error,
      description: errorDescription,
    });
    response
      .clearCookie('authorization')
      .redirect(`${this.frontendOrigin}/error?${query}`);
  }

  public async createSessionToken(
    code: string,
    state?: string,
  ): Promise<[string, CookieOptions]> {
    let fortyTwo: TokenFortyTwoApi;
    let expiresIn = 0;
    const token = await firstValueFrom(
      // Obtain Token from 42 api
      this.fortyTwoService.getTokenWithAuthorizationCode(code, state).pipe(
        tap((r) => {
          expiresIn = r.expires_in;
          fortyTwo = r;
        }),
        // Get user intraId (called login on 42 api)
        switchMap((r) => this.fortyTwoService.getUserInfo(r.access_token)),
        //store infos in DB
        switchMap((r) => this.userService.registerUserOk42(r)),
        // Create Session Token for the ft_transcendence
        map((r) =>
          this.tokenService.sign({
            sub: r.intraId,
            exp: Math.floor(Date.now() / this.thousand) + expiresIn,
            mfa: {enabled: r.mfa_enable, verified: r.mfa_verified},
            fortyTwo,
          }),
        ),
        catchError((error: ErrorFortyTwoApi) => {
			console.log(error);
          throw new UnauthorizedException();
        }),
      ),
    );
    return [
      token,
      {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: expiresIn * this.thousand,
      },
    ];
  }

  public getSessionTokenPublicInfo(payload?: JWTPayload) {
    if (!payload) throw new UnauthorizedException();
    return { sub: payload.sub, exp: payload.exp, mfa: payload['mfa'] };
  }

  private getUserChallengeSecret(subject: string) {
    return 'LMWVYBAAAVES2FKG'; // TODO: get the user secret from database
  }

  public enableChallenge(payload?: JWTPayload) {
    if (!payload) throw new UnauthorizedException();

    if (payload['mfa']['enabled']) throw new BadRequestException();

    // const secret = this.otp.generateSecret(); // TODO: save this information
    const secret = this.getUserChallengeSecret(payload.sub); // TODO: Use generated secret instead
    return {
      secret,
      uri: this.otp.getUri(payload.sub, secret),
    };
  }

  public async verifyChallenge(
    code: string,
    payload: JWTPayload,
  ): Promise<[string, CookieOptions, JWTPayload]> {
    if (!payload) throw new UnauthorizedException();

    if (!code) throw new BadRequestException();

    const secret = this.getUserChallengeSecret(payload.sub);
    const valid = this.otp.verify(code, secret);
    if (!valid) throw new BadRequestException();

    const token = await this.tokenService.sign({
      ...payload,
      mfa: { enabled: true, verified: true },
    });
    return [
      token,
      {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(payload.exp * this.thousand),
      },
      {
        sub: payload.sub,
        exp: payload.exp,
        mfa: { enabled: true, verified: true },
      },
    ];
  }

  public async disableChallenge(
    payload?: JWTPayload,
  ): Promise<[string, CookieOptions, JWTPayload]> {
    // TODO: disable challenge for the user on the database
    const token = await this.tokenService.sign({
      ...payload,
      mfa: { enabled: false, verified: false },
    });

    return [
      token,
      {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(payload.exp * this.thousand),
      },
      {
        sub: payload.sub,
        exp: payload.exp,
        mfa: { enabled: false, verified: false },
      },
    ];
  }
}
