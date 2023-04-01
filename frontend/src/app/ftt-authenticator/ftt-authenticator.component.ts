import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-authenticator',
  templateUrl: './ftt-authenticator.component.html',
  styleUrls: ['./ftt-authenticator.component.css'],
})
export class FttAuthenticatorComponent {
  subject$: Observable<string>;
  constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {
    this.subject$ = authService
      .getAuthContext()
      .pipe(map(ctx => ctx?.sub || 'loading'));
  }
  signOut() {
    this.userService.signOut();
  }
}
