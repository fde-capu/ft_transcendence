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
	private usersUrl = 'http://localhost:3000/user';
	private userByLoginUrl = 'http://localhost:3000/user/userByLogin/?intraId=';
	private updateUserUrl = 'http://localhost:3000/user/update/';
	private saveHttpOptions = 
				{
					withCredentials: true,
					'Content-Type': 'application/json'
				}

	constructor(
		private readonly authService: AuthService,
		private http: HttpClient,
	) {
		this.getCurrentIntraId();
	}

	getCurrentIntraId() {
		this.authService.getAuthContext().subscribe(_=>{this.currentIntraId=_?.sub});
	}

	getUserById(intraId: string): Observable<User | undefined> {
		return this.http
			.get<User>(this.userByLoginUrl + intraId,{withCredentials: true})
			.pipe(
					catchError( err => 
						of(undefined)
					)
				 );
	}

	getLoggedUser(): Observable<User> {
		return this.http.get<User>(this.userByLoginUrl + this.currentIntraId,{withCredentials: true})
	}

	getUser(id: string): Observable<User | undefined> {
		return this.getUserById(id);
	}

	signOut() {
		this.getLoggedUser().subscribe(_=>{
			console.log("fus: ", _.intraId, " will log out.");
			_.isLogged = false;
			this.saveUser(_).subscribe(_=>{
				this.authService.signOut();
			});
		});
	}

	saveUser(u_user: User): Observable<any> {
		//console.log("fos saving:", u_user);
		return this.http.put(
				this.updateUserUrl + u_user.intraId,
				u_user,
				this.saveHttpOptions
			)
			.pipe
			(
				tap(_ => 
					console.log("Saving ok, got:", _)
				),
				catchError(this.handleError<any>('saveUser'))
			);
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

	isFriend(user: User | undefined): Boolean {
		return Math.random() > .6;
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error("handleError<T>:", error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}

