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
import { HelperFunctionsService } from './helper-functions.service';

// TODO: Check if its all unmocked. If so, remove `import { USERS } ...` abome.

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public currentIntraId?: string;
  private currentUser?: User;
  private statsUrl = 'http://localhost:3000/user/stats/?of=';
  private historyUrl = 'http://localhost:3000/user/history/?of=';
  private friendsUrl = 'http://localhost:3000/user/friends/?with=';
  private blocksUrl = 'http://localhost:3000/user/blocks/?them=';
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
    private router: Router,
    private fun: HelperFunctionsService
  ) {
    this.setCurrentIntraId();
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  setCurrentIntraId() {
    this.authService.getAuthContext().subscribe(_ => {
      this.currentIntraId = _?.sub;
      if (this.currentIntraId)
        this.getLoggedUser().subscribe(_ => {
          this.currentUser = _;
        });
    });
  }

  getQuickIntraId() {
    return this.currentIntraId;
  }

  getUserById(intraId: string): Observable<User | undefined> {
    return this.http
      .get<User>(this.userByLoginUrl + intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<any>('getUserById')));
  }

  getLoggedUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    return this.http
      .get<User>(this.userByLoginUrl + this.currentIntraId, {
        withCredentials: true,
      })
      .pipe(
        map(_ => {
          return _;
        }),
        catchError(err => of({} as User))
      );
  }

  getUser(id: string): Observable<User | undefined> {
    return this.getUserById(id);
  }

  signOut() {
    this.getLoggedUser().subscribe(_ => {
      _.isLogged = false;
      this.saveUser(_).subscribe(_ => {
        this.authService.signOut();
      });
    });
  }

  saveUser(u_user: User): Observable<any> {
    //console.log("fos saving:", u_user);
    return this.http
      .put(this.updateUserUrl + u_user.intraId, u_user, this.saveHttpOptions)
      .pipe(
        map(_ => {
          this.router.navigate([this.router.url]);
        }),
        catchError(this.handleError<any>('saveUser'))
      );
  }

  getOnlineUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.onlineUsersUrl, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getOnlineUsers', [])));
  }

  getLadder(): Observable<any[]> {
    return this.http
      .get<User[]>(this.onlineUsersUrl, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getLadder', [])));
    // ^ This is exactly like getOnlineUser(), but if later we want to
    // get all online AND offline users for ranking, this is the place.
  }

  getFriends(u_user?: User): Observable<User[]> {
    if (!u_user) return of([]);
    return this.http
      .get<User[]>(this.friendsUrl + u_user.intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getFriends', [])));
  }

  isFriend(user_b: User | undefined): boolean {
    if (!this.currentUser || !this.currentUser.friends || !user_b) return false;
    return this.fun.isStringInArray(user_b.intraId, this.currentUser.friends);
  }

  makeFriend(user_b: User | undefined): Observable<any> {
    if (!this.currentUser || !user_b) return of(false);
    if (!this.currentUser.friends) this.currentUser.friends = [];
    this.currentUser.friends.push(user_b.intraId);
    return this.saveUser(this.currentUser);
  }

  unFriend(user_b: User | undefined): Observable<any> {
    if (!this.currentUser || !user_b || !this.currentUser.friends)
      return of(false);
    for (let i = 0; i < this.currentUser.friends.length; i++)
      if (this.currentUser.friends[i] == user_b.intraId)
        this.currentUser.friends.splice(i, 1);
    return this.saveUser(this.currentUser);
  }

  getBlocks(u_user?: User): Observable<User[]> {
    if (!u_user) return of([]);
    return this.http
      .get<User[]>(this.blocksUrl + u_user.intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getBlocks', [])));
  }

  amIBlocked(user_b: User | undefined): boolean {
    if (
      !this.currentUser ||
      !user_b ||
      user_b.intraId == this.currentUser.intraId
    )
      return false;
    return this.fun.isStringInArray(this.currentUser.intraId, user_b.blocks);
  }

  isBlock(user_b: User | undefined): boolean {
    if (!this.currentUser || !this.currentUser.blocks || !user_b) return false;
    return this.fun.isStringInArray(user_b.intraId, this.currentUser.blocks);
  }

  makeBlock(user_b: User | undefined): Observable<any> {
    if (!this.currentUser || !user_b) return of(false);
    if (!this.currentUser.blocks) this.currentUser.blocks = [];
    this.currentUser.blocks.push(user_b.intraId);
    return this.saveUser(this.currentUser);
  }

  unBlock(user_b: User | undefined): Observable<any> {
    if (!this.currentUser || !user_b || !this.currentUser.blocks)
      return of(false);
    for (let i = 0; i < this.currentUser.blocks.length; i++)
      if (this.currentUser.blocks[i] == user_b.intraId)
        this.currentUser.blocks.splice(i, 1);
    return this.saveUser(this.currentUser);
  }

  getStats(u_intraId: string): Observable<Statistics> {
    return this.http
      .get<Statistics>(this.statsUrl + u_intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<Statistics>('getStats')));
  }

  getGameHistory(u_intraId: string): Observable<GameHistory[]> {
    return this.http
      .get<GameHistory[]>(this.historyUrl + u_intraId, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError<GameHistory[]>('getGameHistory')));
  }

  async intraIdsToUsers(ulist: string[]): Promise<User[]> {
    if (!ulist || !ulist.length) return [];
    const out: User[] = [];
    for (const one of ulist) {
      this.getUserById(one).subscribe({
        next: _ => {
          if (_) {
            out.push(_);
          }
        },
        error: () => ({}),
      });
    }
    return out;
  }

  getAvailableUsers(): Observable<User[]> {
    // Must return users online, not playing, and not logged user.
    const users = USERS;
    return of(users);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error('handleError<T>:', error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
