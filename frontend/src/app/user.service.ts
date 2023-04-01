import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { GameHistory } from './game-history';
import { AuthService } from './auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Statistics } from './statistics';
import { HelperFunctionsService } from './helper-functions.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public static currentIntraId?: string;
  public static currentUser?: User;
  static isAuthorized = false;
  private statsUrl = `${environment.backendOrigin}/user/stats/?of=`;
  private historyUrl = `${environment.backendOrigin}/user/history/?of=`;
  private friendsUrl = `${environment.backendOrigin}/user/friends/?with=`;
  private blocksUrl = `${environment.backendOrigin}/user/blocks/?them=`;
  private onlineUsersUrl = `${environment.backendOrigin}/user/online`;
  private availableUsersUrl = `${environment.backendOrigin}/user/available`;
  private userByLoginUrl = `${environment.backendOrigin}/user/userByLogin/?intraId=`;
  private updateUserUrl = `${environment.backendOrigin}/user/update/`;
  private updateUserStatus = `${environment.backendOrigin}/user/status/`;
  private attendanceUrl = `${environment.backendOrigin}/user/hi/`;
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
    //console.log("User Service constructor.");
    if (!UserService.currentIntraId) this.setCurrentIntraId();
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  setCurrentIntraId() {
    this.authService.getAuthContext().subscribe(_ => {
      UserService.isAuthorized = true;
      if (_?.sub) UserService.currentIntraId = _?.sub;
      this.announceMe();
      this.keepUpdating();
    });
  }

  async announceMe(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 10391));
    if (!UserService.currentIntraId) return;
    this.http
      .put(
        this.attendanceUrl + UserService.currentIntraId,
        {},
        this.saveHttpOptions
      )
      .pipe(
        catchError(err => {
          UserService.currentIntraId = undefined;
          return of(this.handleError<any>('announceMe'));
        })
      )
      .subscribe();
    this.announceMe();
  }

  async keepUpdating() {
    if (!UserService.currentIntraId) return;
    await new Promise(resolve => setTimeout(resolve, 321)); // Useful for first run.
    this.getLoggedUser()
      .pipe(catchError(this.handleError<any>('setCurrentIntraId')))
      .subscribe(_ => {
        if (_) {
          UserService.currentUser = _;
        }
      });
    await new Promise(resolve => setTimeout(resolve, 9369));
    this.keepUpdating();
  }

  getQuickIntraId() {
    return UserService.currentIntraId;
  }

  getUserById(intraId: string): Observable<User | undefined> {
    if (!UserService.currentIntraId) return of(undefined); // In case server disconnected.
    return this.http
      .get<User>(this.userByLoginUrl + intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<any>('getUserById')));
  }

  getLoggedUser(): Observable<User> {
    //console.log("fUS getting logged user");
    return this.http
      .get<User>(this.userByLoginUrl + UserService.currentIntraId, {
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

  signOut(afterRoute = '/logout') {
    this.setStatus('OFFLINE');
    UserService.isAuthorized = false;
    this.authService.signOut(afterRoute);
  }

  setStatus(stat: string) {
    //console.log("fos setStatus:", u_user.intraId, stat);
    this.http
      .put(
        this.updateUserStatus + UserService.currentIntraId,
        { stat },
        this.saveHttpOptions
      )
      .pipe(catchError(this.handleError<any>('setStatus')))
      .subscribe();
  }

  saveUser(u_user: User): Observable<any> {
    //console.log("fos saving:", u_user);
    return this.http
      .put(this.updateUserUrl + u_user.intraId, u_user, this.saveHttpOptions)
      .pipe(
        map(_ => {
          if (u_user.intraId == UserService.currentIntraId)
            this.getLoggedUser().subscribe(_ => {
              if (_) {
                UserService.currentUser = _;
              }
            });
          //console.log("saveUser will call component refresh.");
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

  getAvailableUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.availableUsersUrl, { withCredentials: true })
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
    if (!UserService.currentUser || !UserService.currentUser.friends || !user_b)
      return false;
    return this.fun.isStringInArray(
      user_b.intraId,
      UserService.currentUser.friends
    );
  }

  makeFriend(user_b: User | undefined): Observable<any> {
    if (!UserService.currentUser || !user_b) return of(false);
    if (!UserService.currentUser.friends) UserService.currentUser.friends = [];
    if (!this.isFriend(user_b))
      UserService.currentUser.friends.push(user_b.intraId);
    return this.saveUser(UserService.currentUser);
  }

  async mutualFriends(
    a: string | undefined,
    b: string | undefined
  ): Promise<void> {
    if (!a || !b) return;
    this.getUser(a).subscribe(u_a => {
      this.getUser(b).subscribe(u_b => {
        if (!u_a) return;
        if (!u_a.friends) u_a.friends = [];
        if (!this.fun.isStringInArray(b, u_a.friends)) {
          u_a.friends.push(b);
          this.saveUser(u_a).subscribe();
        }
        if (!u_b) return;
        if (!u_b.friends) u_b.friends = [];
        if (!this.fun.isStringInArray(a, u_b.friends)) {
          u_b.friends.push(a);
          this.saveUser(u_b).subscribe();
        }
      });
    });
  }

  unFriend(user_b: User | undefined): Observable<any> {
    if (!UserService.currentUser) return of(false);
    if (!user_b) return of(false);
    if (UserService.currentUser.friends)
      UserService.currentUser.friends = this.fun.removeStringFromArray(
        user_b.intraId,
        UserService.currentUser.friends
      );
    if (user_b.friends)
      user_b.friends = this.fun.removeStringFromArray(
        UserService.currentUser.intraId,
        user_b.friends
      );
    this.saveUser(user_b).subscribe();
    this.saveUser(UserService.currentUser).subscribe();
    return of(true);
  }

  getBlocks(u_user?: User): Observable<User[]> {
    if (!u_user) return of([]);
    return this.http
      .get<User[]>(this.blocksUrl + u_user.intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getBlocks', [])));
  }

  amIBlocked(user_b: User | undefined): boolean {
    if (
      !UserService.currentUser ||
      !user_b ||
      user_b.intraId == UserService.currentUser.intraId
    )
      return false;
    return this.fun.isStringInArray(
      UserService.currentUser.intraId,
      user_b.blocks
    );
  }

  isBlock(user_b: User | undefined): boolean {
    if (!UserService.currentUser || !UserService.currentUser.blocks || !user_b)
      return false;
    return this.fun.isStringInArray(
      user_b.intraId,
      UserService.currentUser.blocks
    );
  }

  makeBlock(user_b: User | undefined): Observable<any> {
    if (!UserService.currentUser || !user_b) return of(false);
    if (!UserService.currentUser.blocks) UserService.currentUser.blocks = [];
    UserService.currentUser.blocks.push(user_b.intraId);
    return this.saveUser(UserService.currentUser);
  }

  unBlock(user_b: User | undefined): Observable<any> {
    if (!UserService.currentUser || !user_b || !UserService.currentUser.blocks)
      return of(false);
    for (let i = 0; i < UserService.currentUser.blocks.length; i++)
      if (UserService.currentUser.blocks[i] == user_b.intraId)
        UserService.currentUser.blocks.splice(i, 1);
    return this.saveUser(UserService.currentUser);
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
    const out: User[] = [];
    for (const one of ulist) {
      await this.getUserById(one).subscribe({
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

  authorized() {
    return UserService.isAuthorized;
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.statusCode == 401) {
        UserService.isAuthorized = false;
        if (
          this.router.url.indexOf('/login') != 0 &&
          this.router.url.indexOf('/logout') != 0
        )
          this.signOut();
      }
      console.log('ERROR:::', error.error.statusCode, operation);
      return of(result as T);
    };
  }
}
