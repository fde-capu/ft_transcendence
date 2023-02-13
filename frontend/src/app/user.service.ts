import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Subject
} from 'rxjs';
import { User } from './user';
import { USERS } from './mocks';
import { AuthService } from './auth/service/auth.service';
import { TokenInfoResponse } from './token-info-response';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` above.

@Injectable({
  providedIn: 'root'
})
export class UserService {
	loggedUser = new Subject();
	authContext!: TokenInfoResponse | undefined;
	private usersUrl = 'http://localhost:3000/user';

	constructor(
		private http: HttpClient,
		private readonly authService: AuthService
	) {
		// TODO: implement backport to get next object from backed.
		this.authService.getAuthContext().subscribe(
			ctx => {
				this.authContext = ctx;
				this.loggedUser.next(
					{
						intraId: this.authContext?.sub ? this.authContext.sub : "intraId?",
						name: "name?",
						image: "image?"
					}
				);
			}
		);
	}

	getLoggedUser(): Observable<User> {
		return this.loggedUser.asObservable() as Observable<User>;
	}

	getOnlineUsers(): Observable<User[]> {
		const users = USERS;
		return of(users);
//		CURRENTLY BROKEN (study code):
//		return this.http.get<User[]>(this.usersUrl)
//			.pipe(
//				tap(_ => console.log(_)),
//				catchError(this.handleError<User[]>('getOnlineUsers', []))
//			);
	}

	getAvailableUsers(): Observable<User[]> {
		// Must return users online, not playing, and not logged user.
		const users = USERS;
		return of(users);
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
		return Math.random() > .6;
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
