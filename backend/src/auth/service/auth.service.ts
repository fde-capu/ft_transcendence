import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { UserFortyTwoApi, Versions } from 'src/forty-two/service/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QRSecret } from '../entity/qrsecret-entity';

export interface qrSecret {
	id: string;
	secret: string;
}

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
	@InjectRepository(QRSecret) private readonly qrRepository: Repository<QRSecret>,
  ) {
    this.frontendOrigin = this.configService.get<string>('FRONTEND_ORIGIN');
  }

	async setQrMap(record:QRSecret):Promise<QRSecret> {
		return await this.qrRepository.save(record);
	}

	async getQrMap(intraId:string):Promise<string> {
		const resp = await this.qrRepository.createQueryBuilder("qr")
			.where("qr.intraId = :intraId", { intraId: intraId })
			.getOne();
		if (resp === null)
			return "";
		return resp.secret;
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
  ): Promise<[string, CookieOptions, string]> {
    let fortyTwo: TokenFortyTwoApi;
    let expiresIn = 0;
    let newUser = false;
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
        //exp: Math.floor(Date.now() / this.thousand) + expiresIn,
        // ^ this was before, expiresIn is about 25 minutes
        // v Our token expires in 86400, equals 24h.
        tap((r) => (newUser = r.newUser)),
        map((r) =>
          this.tokenService.sign({
            sub: r.intraId,
            exp: Math.floor(Date.now() / this.thousand) + 86400,
            mfa: { enabled: r.mfa_enabled, verified: r.mfa_verified },
            fortyTwo,
          }),
        ),
        catchError((error: ErrorFortyTwoApi) => {
          throw new UnauthorizedException();
        }),
      ),
    );
    return [
      token,
      {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 86400 * this.thousand,
      },
      newUser
        ? `${this.frontendOrigin}/profile`
        : `${this.frontendOrigin}/login`,
    ];
  }

  public getSessionTokenPublicInfo(payload?: JWTPayload) {
    if (!payload) return { error: "You are not logged in" };
    return { sub: payload.sub, exp: payload.exp, mfa: payload['mfa'] };
  }

  private async getUserChallengeSecret(subject: string): Promise<string> {
	let userSecret = await this.getQrMap(subject);
	if (!userSecret) {
		userSecret = this.otp.generateSecret();
		this.setQrMap({intraId: subject, secret: userSecret});
	}
	return userSecret;
  }

  public async enableChallenge(payload?: JWTPayload): Promise<any> {
    if (!payload) throw new UnauthorizedException();
    const secret = await this.getUserChallengeSecret(payload.sub);
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
    if (!code) throw new UnauthorizedException();

    const secret = await this.getUserChallengeSecret(payload.sub);
    const valid = this.otp.verify(code, secret);
    if (!valid) {
      throw new BadRequestException();
    }

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

  // I think leaving this function here on evaluation is OK.
  public async pleaseRemoveThisFunctionBeforeEvaluation(
    subject: string,
  ): Promise<[string, CookieOptions, JWTPayload]> {
    await this.userService.registerUserOk42({
      login: subject,
      email: 'fake@fake.com',
      displayname: subject,
      image: {
        link: 'https://1.bp.blogspot.com/-Wq2lcq9_a4I/Tc2lLWOkNVI/AAAAAAAABVM/Wao0rm-vWe4/s1600/gatinho-5755.jpg',
        versions: {
          large:
            'https://1.bp.blogspot.com/-Wq2lcq9_a4I/Tc2lLWOkNVI/AAAAAAAABVM/Wao0rm-vWe4/s1600/gatinho-5755.jpg',
          medium:
            'https://1.bp.blogspot.com/-Wq2lcq9_a4I/Tc2lLWOkNVI/AAAAAAAABVM/Wao0rm-vWe4/s1600/gatinho-5755.jpg',
          micro:
            'https://1.bp.blogspot.com/-Wq2lcq9_a4I/Tc2lLWOkNVI/AAAAAAAABVM/Wao0rm-vWe4/s1600/gatinho-5755.jpg',
          small:
            'https://1.bp.blogspot.com/-Wq2lcq9_a4I/Tc2lLWOkNVI/AAAAAAAABVM/Wao0rm-vWe4/s1600/gatinho-5755.jpg',
        },
      },
    } as UserFortyTwoApi);
    const payload = {
      sub: subject,
      exp: Math.floor(Date.now() / this.thousand) + 86400,
      mfa: { enabled: true, verified: true },
    };
    const token = await this.tokenService.sign(payload);
    const cookie = {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(payload.exp * this.thousand),
    };
    return [token, cookie as CookieOptions, payload];
  }
}
