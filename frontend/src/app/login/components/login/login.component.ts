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

  // TODO: Remove it. It is only here for tests proposes.
  // If you want to generate the code use this.authService.getChallenge()
  public challengeUri?: string;

  message?: string;

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
			}
			this.step_two = true;
		}
    },
    });

	this.authService.getChallenge().subscribe({
		next: secret => {
			this.challengeUri = secret;
			this.message = "Please open Google/Microsoft Authenticator and type in the code.";
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
        this.message += ' [' + form.value.code + ']?? Yikes! Wrong code, bud!';
      },
    });
  }

  saveAuth(intraId: string) {
	this.userService.getUserById(intraId).subscribe(_=>{
		if (!_ || (!!_ && !!_.mfa_enabled)) return;
		_.mfa_enabled = true;
		this.userService.saveUser(_).subscribe();
	});
  }

  signOut() {
    this.userService.signOut();
    this.step_two = false;
    this.step_one = true;
  }
}
