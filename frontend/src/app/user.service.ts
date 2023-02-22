import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './user';
import { USERS } from './mocks';

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class UserService {
	loggedUser!: User;

	constructor(private route: ActivatedRoute) {
		this.loggedUser = USERS[Math.floor(Math.random() * USERS.length)];
	}

	getOnlineUsers(): Observable<User[]> {
		const users = USERS;
		return of(users);
	}

	getAvailableUsers(): Observable<User[]> {
		// Must return users online, not playing, and not logged user.
		const users = USERS;
		return of(users);
	}

	getLoggedUser(): Observable<User> {
		return of(this.loggedUser);
	}

	getUserById(intraId: string | null): Observable<User> {
		if (intraId !== null)
			var user = USERS.find(h => h.intraId === intraId)!;
		else
			return this.getLoggedUser();
		return of(user);
	}

	isFriend(user: User): Boolean {
		return Math.random() > .6; // TODO: Unmock.
	}
}
