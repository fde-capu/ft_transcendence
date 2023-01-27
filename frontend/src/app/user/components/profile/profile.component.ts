import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UserResponse } from '../../service/user.response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user$: Observable<UserResponse>;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    this.user$ = this.route.data.pipe(map(({ currentUser }) => currentUser));
  }
  signOut() {
    this.authService.signOut();
  }
}
