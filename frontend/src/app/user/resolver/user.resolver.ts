import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserResponse } from '../service/user.response';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<UserResponse> {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<UserResponse> {
    return this.userService.getCurrentUser();
  }
}
