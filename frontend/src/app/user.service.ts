import { DOCUMENT } from '@angular/common';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mocks';
import { AuthService } from './auth/service/auth.service';
import { TokenInfoResponse } from './token-info-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` abome.

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private currentIntraId?: string;
	private currentUser: User|undefined = undefined;
	private usersUrl = 'http://localhost:3000/user';
	private userByLoginUrl = 'http://localhost:3000/user/userByLogin/?intraId=';

	constructor(
		private readonly authService: AuthService,
		private http: HttpClient,
	) {
		console.log("fus = frontend-user-service: constructor.");
		this.currentIntraId = authService.getCurrentIntraId();
	}

	// This function will 
	getLoggedUser(): Observable<User> {
		console.log("fus getLoggedUserFromBack() run. It knows:", this.currentIntraId);
		return this.http.get<User>(this.userByLoginUrl + this.currentIntraId)
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

	getUserById(intraId: string | null): Observable<User | undefined> {
		if (intraId !== null)
			var user = USERS.find(h => h.intraId === intraId)!;
		else
			return this.getLoggedUser();
		return of(user);
//		return new BehaviorSubject<User | undefined>(user);
	}

	getUser(id: string): Observable<User> {
//		const url = `${this.usersUrl}/${id}`;
//		return this.http.get<User>(url).pipe
//		(
//			tap(_ => console.log(`Got user id=${id}`)),
//			catchError(this.handleError<User>(`getUser id=${id}`))
//		);
		return of(USERS[7]);
	}

	isFriend(user: User | undefined): Boolean {
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

