import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserResponse } from '../../service/user.response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user$: Observable<UserResponse>;
  constructor(private readonly route: ActivatedRoute) {
    this.user$ = this.route.data.pipe(map(({ currentUser }) => currentUser));
  }
}
