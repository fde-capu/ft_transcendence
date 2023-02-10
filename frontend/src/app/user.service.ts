import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mocks';

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class UserService {
	loggedUser!: User;
	private usersUrl = 'http://localhost:3000/user';

	constructor(
		private http: HttpClient
	) {
		this.loggedUser = USERS[Math.floor(Math.random() * USERS.length)];
	}

	getOnlineUsers(): Observable<User[]> {
//		const users = USERS;
//		return of(users);
		return this.http.get<User[]>(this.usersUrl)
			.pipe(
				tap(_ => console.log(_)),
				catchError(this.handleError<User[]>('getOnlineUsers', []))
			);
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

	getUser(id: string): Observable<User> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.get<User>(url).pipe
		(
			tap(_ => console.log(`Got user id=${id}`)),
			catchError(this.handleError<User>(`getUser id=${id}`))
		);
	}

	isFriend(user: User): Boolean {
		return Math.random() > .6; // TODO: Unmock.
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
