import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  signIn() {
    this.authService.signIn();
  }
}
