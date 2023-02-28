import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getAuthContext().pipe(
      map(value => {
        const isAuthenticated =
          value &&
          (!value.mfa.enabled || (value.mfa.enabled && value.mfa.verified));

        const goingToLoggingPage = state.url.includes('/login');

        if (!isAuthenticated && !goingToLoggingPage)
		{
          return this.router.createUrlTree(['/login']);
		}

        if (isAuthenticated && goingToLoggingPage)
		{
          return this.router.createUrlTree(['/']);
		}

        return true;
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getAuthContext().pipe(
      map(value => {
        const isAuthenticated =
          value &&
          (!value.mfa.enabled || (value.mfa.enabled && value.mfa.verified));

        const goingToLoggingPage = state.url.includes('/login');

        if (!isAuthenticated && !goingToLoggingPage)
		{
          return this.router.createUrlTree(['/login']);
		}

        if (isAuthenticated && goingToLoggingPage)
		{
          return this.router.createUrlTree(['/']);
		}

        return true;
      })
    );
  }
}
