import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { encode } from 'querystring';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { TokenFortyTwoApi } from './token';
import { ErrorFortyTwoApi } from './error';
import { TokenInfoFortyTwoApi } from './token-info';
import { UserFortyTwoApi } from './user';

@Injectable()
export class FortyTwoService {
  private clientId: string;

  private redirectUrl: string;

  private clientSecret: string;

  public constructor(
    readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = configService.get<string>('API42_CLIENT_ID');
    this.redirectUrl = `${configService.get<string>('BACKEND_ORIGIN')}/auth/callback`;
    this.clientSecret = configService.get<string>('API42_CLIENT_SECRET');
  }

  public getAuthorizeUrl(state?: string): string {
    const params = encode({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      state,
    });
    return `https://api.intra.42.fr/oauth/authorize?${params}`;
  }

  public getTokenWithAuthorizationCode(
    code: string,
    state?: string,
  ): Observable<TokenFortyTwoApi> {
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      code,
      state,
    };
    return this.httpService
      .post<TokenFortyTwoApi>('https://api.intra.42.fr/oauth/token', payload)
      .pipe(
        map((response) => response.data),
        catchError((error: AxiosError<ErrorFortyTwoApi>) => {
          return throwError(() => error.response.data);
        }),
      );
  }

  public getTokenWithRefreshToken(
    refresh_token: string,
    scope?: string[],
  ): Observable<TokenFortyTwoApi> {
    const payload = {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: scope?.join(' ') || '',
      refresh_token,
    };
    return this.httpService
      .post<TokenFortyTwoApi>('https://api.intra.42.fr/oauth/token', payload)
      .pipe(
        map((response) => response.data),
        catchError((error: AxiosError<ErrorFortyTwoApi>) => {
          return throwError(() => error.response.data);
        }),
      );
  }

  public getTokenInfo(token: string): Observable<TokenInfoFortyTwoApi> {
    return this.httpService
      .get<TokenInfoFortyTwoApi>('https://api.intra.42.fr/oauth/token/info', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((response) => response.data),
        catchError((error: AxiosError<ErrorFortyTwoApi>) => {
          return throwError(() => error.response.data);
        }),
      );
  }

  public getUserInfo(token: string): Observable<UserFortyTwoApi> {
    return this.httpService
      .get<UserFortyTwoApi>('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((response) => response.data),
        catchError((error: AxiosError<ErrorFortyTwoApi>) => {
          return throwError(() => error.response.data);
        }),
      );
  }
}
