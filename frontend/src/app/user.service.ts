import { DOCUMENT } from '@angular/common';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mocks';
import { AuthService } from './auth/service/auth.service';
import { TokenInfoResponse } from './token-info-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` abome.

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private currentIntraId?: string;
	private currentUser?: User;
	private usersUrl = 'http://localhost:3000/user';
	private friendsUrl = 'http://localhost:3000/user/friends/?with=';
	private onlineUsersUrl = 'http://localhost:3000/user/online';
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
		private router: Router,
	) {
		this.getCurrentIntraId();
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
	}

	getCurrentIntraId() {
		this.authService.getAuthContext().subscribe(_=>{
			this.currentIntraId=_?.sub;
			if (this.currentIntraId)
				this.getLoggedUser().subscribe(_=>{this.currentUser=_});
		});
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
			//console.log("fus: ", _.intraId, " will log out.");
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
				map(_=>{
					console.log("saveUser will call component refresh.");
					this.router.navigate([this.router.url])
				}),
				catchError(this.handleError<any>('saveUser'))
			);
	}

	getOnlineUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.onlineUsersUrl,{withCredentials:true})
			.pipe(
				catchError(this.handleError<User[]>('getOnlineUsers', []))
			);
	}

	getFriends(u_user?: User): Observable<User[]> {
		//console.log("getFriends will look for friends of", u_user?.intraId);
		if (u_user)
		{
			//console.log("getFriends will call http.");
			return this.http.get<User[]>(this.friendsUrl+u_user.intraId,{withCredentials:true})
				.pipe(
					catchError(this.handleError<User[]>('getFriends', []))
				);
		}
		return of([]);
	}

	isFriend(user_b: User | undefined): boolean {
		if (!this.currentUser||!this.currentUser.friends) return false;
		for (const friend of this.currentUser.friends)
		{
			if (friend == user_b?.intraId)
				return true;
		}
		return false;
	}

	makeFriend(user_b: User|undefined): Observable<any> {
		if (!this.currentUser||!user_b) return of(false);
		if (!this.currentUser.friends) this.currentUser.friends = [];
		this.currentUser.friends.push(user_b.intraId);
		return this.saveUser(this.currentUser);
	}

	unFriend(user_b: User|undefined): Observable<any> {
		if (!this.currentUser||!user_b||!this.currentUser.friends) return of(false);
		for (var i = 0; i < this.currentUser.friends.length; i++)
			if (this.currentUser.friends[i] == user_b.intraId)
				this.currentUser.friends.splice(i, 1);
		return this.saveUser(this.currentUser);
	}

	getAvailableUsers(): Observable<User[]> {
		// Must return users online, not playing, and not logged user.
		const users = USERS;
		return of(users);
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
