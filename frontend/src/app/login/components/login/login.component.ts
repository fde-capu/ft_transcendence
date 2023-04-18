import { Component, Input, Output, EventEmitter } from '@angular/core';
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
	@Output() close = new EventEmitter();
  step_one: Boolean = false;
  step_two: Boolean = false;
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
        if (!ctx) {
          this.step_one = true;
          return;
        }
        this.step_one = false;
        if (ctx.mfa.enabled) {
          if (ctx.mfa.verified === true) {
            if (this.router.url.indexOf('/login') == 0)
              this.router.navigate(['/']);
            else {
							console.log("Would reload page");
							this.close.emit(null);
						}
          }
          this.step_two = true;
        }
      },
    });

    this.authService.getChallenge().subscribe({
      next: secret => {
        this.challengeUri = secret;
        this.initialMessage =
          'Please open Google/Microsoft Authenticator and type in the code.';
        this.message = this.initialMessage;
      },
      error: () => {
        // User is not authorized, so do nothing.
      },
    });
  }

  ngOnChanges() {
    if (this.stepActivate) this.step_two = true;
  }

  signIn() {
    this.authService.signIn();
  }

  solveChallenge(form: NgForm) {
    this.authService.solveChallenge(form.value.code).subscribe({
      next: () => {
        this.message = 'Nicely done!';
      },
      error: () => {
        this.message =
          this.initialMessage +
          ' [' +
          form.value.code +
          ']?? Yikes! Wrong code, bud!';
      },
    });
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
