import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
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
	console.log("fas = frontend-auth-service: constructor, will subscrive to b/auth/info");
    this.httpClient
      .get<TokenInfoResponse>(`${environment.backendOrigin}/auth/info`, {
        withCredentials: true,
      })
      .subscribe({
        next: res => {
			console.log("fas got http subscription from b/auth/info:", res);
			this.authContext.next(res)
		},
        error: () => {
			console.log("fas got error, will undefine authContext");
			this.authContext.next(undefined)
		}
      });
  }

  public getAuthContext(): Observable<TokenInfoResponse | undefined> {
	console.log("fas getAuthContext run. current ctx:", this.authContext);
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
      .pipe(tap(() => {
		console.log("fas signOut: ctx set to undefined");
		this.authContext.next(undefined);
	  }))
      .subscribe({
        next: () => this.router.navigate(['/login']),
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
        tap(res => {
			console.log("fas solveChallange set new ctx:", res);
			this.authContext.next(res)
		}),
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
        tap(res => {
			console.log("fas disableChallenge set new ctx:", res);
			this.authContext.next(res)
		}),
        map(() => true),
        catchError(() => throwError(() => new Error('You cannot do that!')))
      );
  }
}
