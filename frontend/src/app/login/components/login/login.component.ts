import { Component } from '@angular/core';
import { tap } from 'rxjs';
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

  constructor(private readonly authService: AuthService) {
    this.authService
      .getAuthContext()
      .pipe(tap(e => console.log(e)))
      .subscribe({
        next: ctx => {
          if (ctx) {
            this.isAuthenticated = true;
            this.challengeEnabled = ctx.mfa.enabled;
          }
        },
      });
  }

  signIn() {
    this.authService.signIn();
  }

  solveChallenge(token: string) {
    this.authService.solveChallenge(token).subscribe({
      next: () => {
        this.message = 'Nicely done!';
      },
      error: () => {
        this.message = 'Yikes! Wrong code, bud!';
      },
    });
  }
}
