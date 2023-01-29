import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user-interface';
import { USERS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getOnlineUsers(): Observable<User[]> {
	const users = of(USERS);
	return users;
  }

  getLoggedUser(): User {
	return USERS[Math.floor(Math.random() * USERS.length)];
  }
}
