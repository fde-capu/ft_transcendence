import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map(v => {
        if (v) return true;
        return this.router.createUrlTree(['/login']);
      })
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map(v => {
        if (v) return true;
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
