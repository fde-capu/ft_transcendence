import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getAuthContext().pipe(
      map(value => {
        const isAuthenticated =
          (value &&
            (!value.mfa.enabled ||
              (value.mfa.enabled && value.mfa.verified))) ||
          false;

        const isInLoginPage = state.url.includes('/login');

        if (!isAuthenticated && !isInLoginPage) {
          return this.router.createUrlTree(['/login']);
        }

        if (isAuthenticated && isInLoginPage) {
          return this.router.createUrlTree(['/']);
        }

        if (!isAuthenticated && isInLoginPage) {
          return true;
        }

        return true;
      })
    );
  }
}
