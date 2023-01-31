// TODO: (this TODO is way out of place!): remove -interface from type files.

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './user-interface';
import { USERS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	loggedUser!: User;

	constructor(private route: ActivatedRoute) {
		this.loggedUser = USERS[Math.floor(Math.random() * USERS.length)];
	}

	ngOnInit() {
	}

	// TODO: all Observables are mocked. Unmock them!

	getOnlineUsers(): Observable<User[]> {
		const users = USERS;
		return of(users);
	}

	getLoggedUser(): Observable<User> {
		return of(this.loggedUser);
	}

	getUserById(intraId: string): Observable<User> {
		const user = USERS.find(h => h.intraId === intraId)!;
		return of(user);
	}
}
