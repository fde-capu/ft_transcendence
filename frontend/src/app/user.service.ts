import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { GameHistory } from './game-history';
import { USERS } from './mocks';
import { AuthService } from './auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Statistics } from './statistics';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` abome.

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentIntraId?: string;
  private currentUser?: User;
  private statsUrl = 'http://localhost:3000/user/stats/?of=';
  private historyUrl = 'http://localhost:3000/user/history/?of=';
  private friendsUrl = 'http://localhost:3000/user/friends/?with=';
  private onlineUsersUrl = 'http://localhost:3000/user/online';
  private userByLoginUrl = 'http://localhost:3000/user/userByLogin/?intraId=';
  private updateUserUrl = 'http://localhost:3000/user/update/';
  private saveHttpOptions = {
    withCredentials: true,
    'Content-Type': 'application/json',
  };

  constructor(
    private readonly authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.getCurrentIntraId();
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  getCurrentIntraId() {
    this.authService.getAuthContext().subscribe(_ => {
      this.currentIntraId = _?.sub;
      if (this.currentIntraId)
        this.getLoggedUser().subscribe(_ => {
          this.currentUser = _;
        });
    });
  }

  getUserById(intraId: string): Observable<User | undefined> {
    return this.http
      .get<User>(this.userByLoginUrl + intraId, { withCredentials: true })
      .pipe(catchError(() => of(undefined)));
  }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(this.userByLoginUrl + this.currentIntraId, {
      withCredentials: true,
    });
  }

  getUser(id: string): Observable<User | undefined> {
    return this.getUserById(id);
  }

  signOut() {
    this.getLoggedUser().subscribe(user => {
      user.isLogged = false;
      this.saveUser(user).subscribe({
        next: () => {
          this.authService.signOut();
        },
      });
    });
  }

  saveUser(u_user: User): Observable<unknown> {
    return this.http
      .put(this.updateUserUrl + u_user.intraId, u_user, this.saveHttpOptions)
      .pipe(
        map(() => {
          this.router.navigate([this.router.url]);
        }),
        catchError(this.handleError<unknown>('saveUser'))
      );
  }

  getOnlineUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.onlineUsersUrl, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getOnlineUsers', [])));
  }

  getFriends(u_user?: User): Observable<User[]> {
    if (u_user) {
      return this.http
        .get<User[]>(this.friendsUrl + u_user.intraId, {
          withCredentials: true,
        })
        .pipe(catchError(this.handleError<User[]>('getFriends', [])));
    }
    return of([]);
  }

  isFriend(user_b?: User): boolean {
    if (!this.currentUser || !this.currentUser.friends) return false;
    for (const friend of this.currentUser.friends) {
      if (friend == user_b?.intraId) return true;
    }
    return false;
  }

  makeFriend(user_b?: User): Observable<unknown> {
    if (!this.currentUser || !user_b) return of(false);
    if (!this.currentUser.friends) this.currentUser.friends = [];
    this.currentUser.friends.push(user_b.intraId);
    return this.saveUser(this.currentUser);
  }

  unFriend(user_b?: User): Observable<unknown> {
    if (!this.currentUser || !user_b || !this.currentUser.friends)
      return of(false);
    for (let i = 0; i < this.currentUser.friends.length; i++)
      if (this.currentUser.friends[i] == user_b.intraId)
        this.currentUser.friends.splice(i, 1);
    return this.saveUser(this.currentUser);
  }

  getStats(u_intraId: string): Observable<Statistics> {
    return this.http
      .get<Statistics>(this.statsUrl + u_intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<Statistics>('getFriends')));
  }

  getGameHistory(u_intraId: string): Observable<GameHistory[]> {
    return this.http
      .get<GameHistory[]>(this.historyUrl + u_intraId, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError<GameHistory[]>('getGameHistory')));
  }

  getAvailableUsers(): Observable<User[]> {
    // Must return users online, not playing, and not logged user.
    const users = USERS;
    return of(users);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    console.log(operation);
    return (error: unknown): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error('handleError<T>:', error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
