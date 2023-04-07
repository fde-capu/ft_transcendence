import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
import { Router } from '@angular/router';
import { TokenInfoResponse } from '../../token-info-response';

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
      .get<TokenInfoResponse>(`${environment.BACKEND_ORIGIN}/auth/info`, {
        withCredentials: true,
      })
      .subscribe({
        next: res => {
          if (res.error) this.authContext.next(undefined);
          else this.authContext.next(res);
        },
        error: () => {
          this.authContext.next(undefined);
        },
      });
  }

  public getAuthContext(): Observable<TokenInfoResponse | undefined> {
    return this.authContext.asObservable();
  }

  public signIn(): void {
    this.document.location.href = `${environment.BACKEND_ORIGIN}/auth/authorize`;
  }

  public signOut(afterRoute = '/logout'): void {
    this.httpClient
      .get(`${environment.BACKEND_ORIGIN}/auth/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.authContext.next(undefined);
        })
      )
      .subscribe({
        next: () => this.router.navigate([afterRoute]),
      });
  }

  public getChallenge(): Observable<string> {
    return this.httpClient
      .get<ChallengeResponse>(`${environment.BACKEND_ORIGIN}/auth/challenge`, {
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
        `${environment.BACKEND_ORIGIN}/auth/challenge`,
        {
          token,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(res => {
          this.authContext.next(res);
        }),
        map(() => true),
        catchError(() => throwError(() => new Error('Invalid token!')))
      );
  }

  public disableChallenge(): Observable<boolean> {
    return this.httpClient
      .delete<TokenInfoResponse>(
        `${environment.BACKEND_ORIGIN}/auth/challenge`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(res => {
          this.authContext.next(res);
        }),
        map(() => true),
        catchError(() => throwError(() => new Error('You cannot do that!')))
      );
  }
}
