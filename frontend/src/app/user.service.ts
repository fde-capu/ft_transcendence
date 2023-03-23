import { DOCUMENT } from '@angular/common';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, from } from 'rxjs';
import { User } from './user';
import { GameHistory } from './game-history';
import { USERS } from './mocks';
import { AuthService } from './auth/service/auth.service';
import { TokenInfoResponse } from './token-info-response';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Statistics } from './statistics';
import { HelperFunctionsService } from './helper-functions.service';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` abome.

@Injectable({
  providedIn: 'root'
})
export class UserService {
	public static currentIntraId?: string;
	public static currentUser?: User;
	static isAuthorized: boolean = false;
	private statsUrl = 'http://localhost:3000/user/stats/?of=';
	private historyUrl = 'http://localhost:3000/user/history/?of=';
	private friendsUrl = 'http://localhost:3000/user/friends/?with=';
	private blocksUrl = 'http://localhost:3000/user/blocks/?them=';
	private onlineUsersUrl = 'http://localhost:3000/user/online';
	private availableUsersUrl = 'http://localhost:3000/user/available';
	private userByLoginUrl = 'http://localhost:3000/user/userByLogin/?intraId=';
	private updateUserUrl = 'http://localhost:3000/user/update/';
	private updateUserStatus = 'http://localhost:3000/user/status/';
	private attendanceUrl = 'http://localhost:3000/user/hi/';
	private saveHttpOptions = 
				{
					withCredentials: true,
					'Content-Type': 'application/json'
				}

	constructor(
		private readonly authService: AuthService,
		private http: HttpClient,
		private router: Router,
		private fun: HelperFunctionsService,
	) {
		//console.log("User Service constructor.");
		this.setCurrentIntraId();
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
	}

	setCurrentIntraId() {
		this.authService.getAuthContext().subscribe(_=>{
			UserService.isAuthorized = true;
			if (_?.sub)
				UserService.currentIntraId=_?.sub;
			if (UserService.currentIntraId)
				this.getLoggedUser()
				.pipe(catchError(this.handleError<any>('setCurrentIntraId')))
				.subscribe(_=>{if(_){UserService.currentUser=_;}});
		});
		this.announceMe();
	}

	async announceMe(): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, 2391));
		if (!UserService.currentIntraId) return this.setCurrentIntraId();
		this.http.put(
				this.attendanceUrl + UserService.currentIntraId,
				{},
				this.saveHttpOptions
			).pipe(
				catchError(err=>{
					UserService.currentIntraId = undefined;
					return of(this.handleError<any>('announceMe'));
				})
			).subscribe();
		this.announceMe();
	}

	getQuickIntraId() {
		return UserService.currentIntraId;
	}

	getUserById(intraId: string): Observable<User | undefined> {
		if (!UserService.currentIntraId) return of(undefined); // In case server disconnected.
		return this.http
			.get<User>(this.userByLoginUrl + intraId,{withCredentials: true})
			.pipe(catchError(this.handleError<any>('getUserById')))
	}

	getLoggedUser(): Observable<User> {
		//console.log("fUS getting logged user");
		return this.http.get<User>(this.userByLoginUrl + UserService.currentIntraId,{withCredentials: true})
			.pipe(map(_=>{
				return _;
			}),
			catchError(err => of({} as User)));
	}

	getUser(id: string): Observable<User | undefined> {
		return this.getUserById(id);
	}

	signOut(afterRoute: string = '/logout') {
		this.setStatus("OFFLINE");
		UserService.isAuthorized = false;
		this.authService.signOut(afterRoute);
	}

	setStatus(stat: string) {
		//console.log("fos setStatus:", u_user.intraId, stat);
		this.http.put(
				this.updateUserStatus + UserService.currentIntraId,
				{ stat },
				this.saveHttpOptions
			).pipe(
				catchError(this.handleError<any>('setStatus'))
			).subscribe();
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
					//console.log("saveUser will call component refresh.");
					this.router.navigate([this.router.url])
				}),
				catchError(this.handleError<any>('saveUser'))
			);
	}

	getOnlineUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.onlineUsersUrl,{withCredentials:true})
			.pipe(catchError(this.handleError<User[]>('getOnlineUsers', [])));
	}

	getAvailableUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.availableUsersUrl,{withCredentials:true})
			.pipe(catchError(this.handleError<User[]>('getOnlineUsers', [])));
	}

	getLadder(): Observable<any[]> {
		return this.http.get<User[]>(this.onlineUsersUrl,{withCredentials:true})
			.pipe(catchError(this.handleError<User[]>('getLadder', [])));
		// ^ This is exactly like getOnlineUser(), but if later we want to
		// get all online AND offline users for ranking, this is the place.
	}

	getFriends(u_user?: User): Observable<User[]> {
		if (!u_user) return of([]);
		return this.http.get<User[]>(this.friendsUrl+u_user.intraId,{withCredentials:true})
			.pipe(catchError(this.handleError<User[]>('getFriends', [])));
	}

	isFriend(user_b: User | undefined): boolean {
		if (!UserService.currentUser||!UserService.currentUser.friends||!user_b) return false;
		return this.fun.isStringInArray(user_b.intraId, UserService.currentUser.friends);
	}

	makeFriend(user_b: User|undefined): Observable<any> {
		if (!UserService.currentUser||!user_b) return of(false);
		if (!UserService.currentUser.friends) UserService.currentUser.friends = [];
		if (!this.isFriend(user_b))
			UserService.currentUser.friends.push(user_b.intraId);
		return this.saveUser(UserService.currentUser);
	}

	unFriend(user_b: User|undefined): Observable<any> {
		if (!UserService.currentUser||!user_b||!UserService.currentUser.friends) return of(false);
		for (var i = 0; i < UserService.currentUser.friends.length; i++)
			if (UserService.currentUser.friends[i] == user_b.intraId)
				UserService.currentUser.friends.splice(i, 1);
		return this.saveUser(UserService.currentUser);
	}

	getBlocks(u_user?: User): Observable<User[]> {
		if (!u_user) return of([])
		return this.http.get<User[]>(this.blocksUrl+u_user.intraId,{withCredentials:true})
			.pipe(catchError(this.handleError<User[]>('getBlocks', [])));
	}

	amIBlocked(user_b: User|undefined): boolean {
		//console.log("Am I", UserService.currentUser?.intraId, "blocked by?", user_b?.intraId);
		if (!UserService.currentUser||!user_b||(user_b.intraId==UserService.currentUser.intraId)) return false;
		//console.log(user_b);
		return this.fun.isStringInArray(UserService.currentUser.intraId, user_b.blocks);
	}

	isBlock(user_b: User | undefined): boolean {
		if (!UserService.currentUser||!UserService.currentUser.blocks||!user_b) return false;
		return this.fun.isStringInArray(user_b.intraId, UserService.currentUser.blocks);
	}

	makeBlock(user_b: User|undefined): Observable<any> {
		if (!UserService.currentUser||!user_b) return of(false);
		if (!UserService.currentUser.blocks) UserService.currentUser.blocks = [];
		UserService.currentUser.blocks.push(user_b.intraId);
		return this.saveUser(UserService.currentUser);
	}

	unBlock(user_b: User|undefined): Observable<any> {
		if (!UserService.currentUser||!user_b||!UserService.currentUser.blocks) return of(false);
		for (var i = 0; i < UserService.currentUser.blocks.length; i++)
			if (UserService.currentUser.blocks[i] == user_b.intraId)
				UserService.currentUser.blocks.splice(i, 1);
		return this.saveUser(UserService.currentUser);
	}

	getStats(u_intraId: string): Observable<Statistics> {
		//console.log("getStats will look for stats of", u_intraId);
		return this.http.get<Statistics>(this.statsUrl+u_intraId,{withCredentials:true})
			.pipe(catchError(this.handleError<Statistics>('getStats')));
	}

	getGameHistory(u_intraId: string): Observable<GameHistory[]> {
		//console.log("getGameHistory will call http for ", u_intraId);
		return this.http.get<GameHistory[]>(this.historyUrl+u_intraId,{withCredentials:true})
			.pipe(catchError(this.handleError<GameHistory[]>('getGameHistory')));
	}

	async intraIdsToUsers(ulist: string[]): Promise<User[]> {
		if (!ulist || !ulist.length || !this.authorized()) return [];
		let out: User[] = [];
		for (const one of ulist)
		{
			this.getUserById(one).subscribe(_=>{
				if (_)
				{
					//console.log("intraIdsToUsers:", _);
					out.push(_)
				}
			}, error => {
				//console.log("intraIdsToUsers Error");
			});
		}
		return out;
	}

	authorized() {
		//console.log("Returning", UserService.isAuthorized);
		return UserService.isAuthorized;
	}

	public handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			if (error.error.statusCode == 401) {
				UserService.isAuthorized = false;
				if (this.router.url.indexOf("/login") != 0
				&& this.router.url.indexOf("/logout") != 0)
					this.signOut();
			}
			//console.error(">> ft_transcendence controlled error (user.service):", error); // log to console instead
			console.log("ERROR:::", error.error.statusCode, operation);
			return of(result as T);
		};
	}
}
