import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import {
  catchError,
  map,
  Observable,
  ReplaySubject,
  Subject,
  tap,
  throwError,
} from 'rxjs';

export interface TokenInfoResponse {
  sub: string;
  exp: number;
  mfa: {
    enabled: boolean;
    verified: boolean;
  };
}

interface ChallengeResponse {
  secret: string;
  uri: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authContext: Subject<TokenInfoResponse | undefined> =
    new ReplaySubject(1);

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {
    this.httpClient
      .get<TokenInfoResponse>(`${environment.backendOrigin}/auth/info`, {
        withCredentials: true,
      })
      .subscribe({
        next: res => this.authContext.next(res),
        error: () => this.authContext.next(undefined),
      });
    this.authContext.subscribe({
      next: ctx => {
        if (ctx) this.router.navigate(['/']);
        else this.router.navigate(['/login']);
      },
    });
  }

  public getAuthContext(): Observable<TokenInfoResponse | undefined> {
    return this.authContext.asObservable();
  }

  public signIn(): void {
    this.document.location.href = `${environment.backendOrigin}/auth/authorize`;
  }

  public signOut(): void {
    this.httpClient
      .get(`${environment.backendOrigin}/auth/logout`, {
        withCredentials: true,
      })
      .subscribe({
        next: async () => {
          this.authContext.next(undefined);
        },
      });
  }

  public getChallenge(): Observable<string> {
    return this.httpClient
      .get<ChallengeResponse>(`${environment.backendOrigin}/auth/challenge`, {
        withCredentials: true,
      })
      .pipe(
        map(res => res.uri),
        catchError(() =>
          throwError(() => new Error('Your challenge is already enabled!'))
        )
      );
  }

  public solveChallenge(token: string): Observable<boolean> {
    return this.httpClient
      .post<TokenInfoResponse>(
        `${environment.backendOrigin}/auth/challenge`,
        {
          token,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(res => this.authContext.next(res)),
        map(() => true),
        catchError(() => throwError(() => new Error('Invalid token!')))
      );
  }

  public disableChallenge(): Observable<boolean> {
    return this.httpClient
      .delete<TokenInfoResponse>(
        `${environment.backendOrigin}/auth/challenge`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(res => this.authContext.next(res)),
        map(() => true),
        catchError(() => throwError(() => new Error('You cannot do that!')))
      );
  }
}
