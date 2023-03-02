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
	console.log("Guard canActivate? will call fas:getAuthContext");
    return this.authService.getAuthContext().pipe(
      map(value => {
		console.log("Guard canActivate got:", value);

        const isAuthenticated = (
			value &&
			(!value.mfa.enabled || (value.mfa.enabled && value.mfa.verified))
		  ) || false;

        const isInLoginPage = state.url.includes('/login');
		console.log("Guard isAuthenticated:", isAuthenticated, "...isInLoginPage:" , isInLoginPage);

        if (!isAuthenticated && !isInLoginPage)
		{
			console.log("Guard canActivate says: go to /login");
          return this.router.createUrlTree(['/login']);
		}

        if (isAuthenticated && isInLoginPage)
		{
			console.log("Guard canActivate says: go to /");
          return this.router.createUrlTree(['/']);
		}

        if (!isAuthenticated && isInLoginPage)
		{
			console.log("Guard canActivate says: wait a minute! Please login.");
			return true;
		}

		console.log("Guard canActivate says: yes.");
        return true;
      })
    );
  }
}
