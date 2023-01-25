import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
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
    return this.authService.isAuthenticated().pipe(
      map(value => {
        if (state.url.includes('/login')) {
          if (value) return this.router.createUrlTree(['/']);
          return true;
        }
        if (value) return true;
        return this.router.createUrlTree(['/login']);
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map(value => {
        if (state.url.includes('/login')) {
          if (value) return this.router.createUrlTree(['/']);
          return true;
        }
        if (value) return true;
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
