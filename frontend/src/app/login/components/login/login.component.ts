import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isAuthenticated = false;

  challengeEnabled = false;

  // TODO: Remove it. It is only here for tests proposes. If you want to generate the code use this.authService.getChallenge()
  challengeUri =
    'otpauth://totp/ft_transcendence:msales-a?secret=LMWVYBAAAVES2FKG&period=30&digits=6&algorithm=SHA1&issuer=ft_transcendence';

  message?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.getAuthContext().subscribe({
      next: ctx => {
        this.isAuthenticated = !!ctx;
        this.challengeEnabled = ctx?.mfa.enabled || false;
        if (ctx?.mfa.verified) this.router.navigate(['/']);
      },
    });
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
        this.message = 'Yikes! Wrong code, bud!';
      },
    });
  }

  signOut() {
    this.authService.signOut();
  }
}
