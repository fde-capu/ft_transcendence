import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UserService } from '../../../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	@Input() stepActivate: boolean = false;
	step_one: Boolean = false;
	step_two: Boolean = false;
	authOk: Boolean = false;
	public challengeUri?: string;
  message?: string;
  initialMessage?: string;

  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.getAuthContext().subscribe({
      next: ctx => {
		//console.log("login got new ctx", ctx);
		if (!ctx) { this.step_one = true; return; }
		this.step_one = false;
		if (ctx.mfa.enabled)
		{
			if (ctx.mfa.verified === true)
			{
				this.authOk = true;
				this.saveAuth(ctx.sub);
				//console.log("Login authorized with MFA.");
				if (this.router.url.indexOf("/login") == 0)
					this.router.navigate(['/']);
				else
					this.router.navigate([this.router.url]);
			}
			this.step_two = true;
		}
	  },
    });

	this.authService.getChallenge().subscribe({
		next: secret => {
			this.challengeUri = secret;
			this.initialMessage = "Please open Google/Microsoft Authenticator and type in the code.";
			this.message = this.initialMessage;
		},
		error: () => {
			console.log("Subscription went wrong!");
		},
	});
  }

	ngOnChanges() {
		if (this.stepActivate)
			this.step_two = true;
	}

  signIn() {
    this.authService.signIn();
  }

  solveChallenge(form: NgForm) {
    this.authService.solveChallenge(form.value.code).subscribe({
      next: () => {
        this.message = 'Nicely done!';
				this.authOk = true;
      },
      error: () => {
        this.message = this.initialMessage + ' [' + form.value.code + ']?? Yikes! Wrong code, bud!';
      },
    });
  }

  saveAuth(intraId: string) {
		const u = this.userService.getUser(intraId);
		if (!u || (!!u && !!u.mfa_enabled)) return;
		u.mfa_enabled = true;
		this.userService.saveUser(u).subscribe();
  }

  signOut() {
    this.userService.signOut();
    this.step_two = false;
    this.step_one = true;
  }

	cancel() {
		this.router.navigate([this.router.url]);
	}
}
