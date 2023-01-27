import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter, Observable, tap } from 'rxjs';
import { AuthService, TokenInfoResponse } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isAuthenticated = false;

  challengeEnabled = false;

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
        this.message = 'uhu mfa completo!';
      },
      error: () => {
        this.message = 'o codigo está errado!';
      },
    });
  }
}
