import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './user-interface';
import { USERS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {}

	// TODO: all Observables are mocked (of), just unmock them!

	getOnlineUsers(): Observable<User[]> {
		const users = USERS;
		return of(users);
	}

	getLoggedUser(): Observable<User> {
		const loggedUser = USERS[Math.floor(Math.random() * USERS.length)];
		return of(loggedUser);
	}

	getUserById(intraId: string): Observable<User> {
		const user = USERS.find(h => h.intraId === intraId)!;
		console.log("F", user);
		return of(user);
	}
}
