import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UserService } from '../../../user.service';
import { USERS } from '../../../mocks';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	step_one: Boolean = false;
	step_two: Boolean = false;

  // TODO: Remove it. It is only here for tests proposes. If you want to generate the code use this.authService.getChallenge()
  challengeUri =
    'otpauth://totp/ft_transcendence:msales-a?secret=LMWVYBAAAVES2FKG&period=30&digits=6&algorithm=SHA1&issuer=ft_transcendence';

  message?: string;

  constructor(
	private userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
	//console.log("login will subscribe to fas getAuthContext");
    this.authService.getAuthContext().subscribe({
      next: ctx => {
		//console.log("login got new ctx", ctx);
		if (!ctx) { this.step_one = true; return; }
		this.step_one = false;
		if (ctx.mfa.enabled)
		{
			if (ctx.mfa.verified === true)
			{
				//console.log("Login authorized with MFA.");
				this.router.navigate(['/']);
			}
			this.step_two = true;
			this.message = ctx?.sub + ", you have enabled 2FA. Please scan this quick response code on Google or Microsoft Authenticator if you haven't already:";
		}
      },
    });
  }

  signIn() {
	//console.log("Login signing in");
    this.authService.signIn();
  }

  solveChallenge(form: NgForm) {
    this.authService.solveChallenge(form.value.code).subscribe({
      next: () => {
        this.message = 'Nicely done!';
      },
      error: () => {
        this.message += " [" + form.value.code + ']?? Yikes! Wrong code, bud!';
      },
    });
  }

  signOut() {
    this.userService.signOut();
	this.step_two = false;
	this.step_one = true;
  }
}
