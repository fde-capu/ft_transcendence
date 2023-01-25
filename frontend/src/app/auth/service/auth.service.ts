import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$: Subject<boolean> = new ReplaySubject(1);

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {
    this.httpClient
      .get('http://localhost:3000/auth/info', {
        withCredentials: true,
      })
      .subscribe({
        next: () => this.isAuthenticated$.next(true),
        error: () => this.isAuthenticated$.next(false),
      });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  public signIn(): void {
    this.document.location.href = 'http://localhost:3000/auth/authorize';
  }

  public signOut(): void {
    this.httpClient
      .get('http://localhost:3000/auth/logout', {
        withCredentials: true,
      })
      .pipe(tap(() => this.isAuthenticated$.next(false)))
      .subscribe({
        next: async () => {
          console.log('cade?');
          await this.router.navigate(['login']);
        },
      });
  }
}
