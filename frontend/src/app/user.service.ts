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

	// This does not make sense to be a service...
	getLoggedUser(): Observable<User> {
		const loggedUser = of(USERS[Math.floor(Math.random() * USERS.length)]);
		return loggedUser;
	}

	// This ALSO does not make sense to be a service...
	getUserFromURI(): Observable<User> {
		const userFromURI = of(USERS[Math.floor(Math.random() * USERS.length)]);
		return userFromURI;
	}
}
