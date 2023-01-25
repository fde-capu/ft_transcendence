import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$: Subject<boolean> = new ReplaySubject(1);

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly httpClient: HttpClient
  ) {
    this.verify().subscribe({
      next: () => this.isAuthenticated$.next(true),
      error: () => this.isAuthenticated$.next(false),
    });
  }

  /**
   * @description **verify** is designed for internal use in AuthModule only. Use **isAuthenticated** instead.
   */
  public verify(): Observable<boolean> {
    return this.httpClient
      .get('http://localhost:3000/auth/info', {
        withCredentials: true,
      })
      .pipe(
        map(() => {
          this.isAuthenticated$.next(true);
          return true;
        }),
        catchError(() => {
          this.isAuthenticated$.next(false);
          return of(false);
        })
      );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  public signIn(): void {
    this.document.location.href = 'http://localhost:3000/auth/authorize';
  }

  public signOut(): void {
    this.document.location.href = 'http://localhost:3000/auth/logout';
  }
}
