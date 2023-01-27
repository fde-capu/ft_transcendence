import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user-interface';
import { USERS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedUser?: Observable<User>;
  constructor() {}

  getOnlineUsers(): Observable<User[]> {
	const users = of(USERS);
	return users;
  }

//  getLoggedUser(): Observable<User> {
//	const users = of(USERS);
//	return users[8];
//  }
}
