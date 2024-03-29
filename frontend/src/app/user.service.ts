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
import { OnlineSocket } from './online.socket';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public static currentIntraId?: string;
  public static currentUser?: User;
  public static all: User[] = [];
  public static running: boolean = false;
  static isAuthorized = false;
  private statsUrl = `${environment.BACKEND_ORIGIN}/user/stats/?of=`;
  private historyUrl = `${environment.BACKEND_ORIGIN}/user/history/?of=`;
  private friendsUrl = `${environment.BACKEND_ORIGIN}/user/friends/?with=`;
  private blocksUrl = `${environment.BACKEND_ORIGIN}/user/blocks/?them=`;
  private onlineUsersUrl = `${environment.BACKEND_ORIGIN}/user/online`;
  private allUsersUrl = `${environment.BACKEND_ORIGIN}/user/all`;
  private availableUsersUrl = `${environment.BACKEND_ORIGIN}/user/available`;
  private userByLoginUrl = `${environment.BACKEND_ORIGIN}/user/userByLogin/?intraId=`;
  private updateUserUrl = `${environment.BACKEND_ORIGIN}/user/update/`;
  private updateUserStatus = `${environment.BACKEND_ORIGIN}/user/status/`;
  private attendanceUrl = `${environment.BACKEND_ORIGIN}/user/hi/`;
  private saveHttpOptions = {
    withCredentials: true,
    'Content-Type': 'application/json',
  };

  constructor(
    private readonly authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private readonly onlineSocket: OnlineSocket,
    private fun: HelperFunctionsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.setCurrentIntraId();
    this.announceMe();
    this.keepUpdating();
    this.getAllUsersCycle(3333);
  }

  async setCurrentIntraId() {
    if (UserService.currentIntraId) {
      this.getSingleUser(UserService.currentIntraId).subscribe(_ => {
        UserService.currentUser = _;
      });
      return;
    }
    this.authService.getAuthContext().subscribe(_ => {
      if (_?.sub) {
        UserService.isAuthorized = true;
        UserService.currentIntraId = _?.sub;
      }
    });
    await new Promise(resolve => setTimeout(resolve, 111));
    this.setCurrentIntraId();
  }

  async announceMe(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 5555));
    // ^ Say hi to backend every 5 seconds.
    if (!UserService.currentIntraId && !UserService.isAuthorized)
      return this.announceMe();
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

  async keepUpdating(): Promise<void> {
    if (!UserService.currentIntraId) {
      await new Promise(resolve => setTimeout(resolve, 116));
      return this.keepUpdating();
    }
    let u = this.getUser(UserService.currentIntraId);
    if (!!u) UserService.currentUser = u;
    await new Promise(resolve => setTimeout(resolve, 1369));
    this.keepUpdating();
  }

  getQuickIntraId() {
    return UserService.currentIntraId;
  }

  getUser(id: string | undefined): User | undefined {
    if (!id || !UserService.all.length) return undefined;
    for (const u of UserService.all) if (u.intraId == id) return u;
    return undefined;
  }

  getLoggedUser(): User | undefined {
    return this.getUser(UserService.currentIntraId);
  }

  signOut(afterRoute = '/logout') {
    UserService.running = false;
    UserService.isAuthorized = false;
    this.authService.signOut(afterRoute);
  }

  async setStatus(stat: string): Promise<void> {
    if (!UserService.currentIntraId) {
      await new Promise(resolve => setTimeout(resolve, 101));
      return this.setStatus(stat);
    }
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
    return this.http
      .put(this.updateUserUrl + u_user.intraId, u_user, this.saveHttpOptions)
      .pipe(
        map(_ => {
          if (u_user.intraId == UserService.currentIntraId) {
            UserService.currentUser = this.getLoggedUser();
          }
          //this.router.navigate([this.router.url])
        }),
        catchError(this.handleError<any>('saveUser'))
      );
  }

  async getAllUsersCycle(deltaMs: number) {
    if (UserService.running) {
      this.getAllUsers().subscribe(_ => {
        UserService.all = _;
      });
    }
    await new Promise(resolve => setTimeout(resolve, deltaMs));
    this.getAllUsersCycle(deltaMs);
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.allUsersUrl, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getAllUsers', [])));
  }

  getSingleUser(intraId: string): Observable<User> {
    return this.http
      .get<User>(this.userByLoginUrl + intraId, { withCredentials: true })
      .pipe(catchError(this.handleError<User>('getSingleUser')));
  }

  getAvailableUsers(): User[] {
    let out: User[] = [];
    for (const u of UserService.all)
      if (u.status != 'OFFLINE' && u.status != 'INGAME') out.push(u);
    return out;
  }

  getFriends(u_user?: User): User[] | undefined {
    if (!u_user) return undefined;
    return this.intraIdsToUsers(u_user.friends);
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
    if (!this.isFriend(user_b)) {
      UserService.currentUser.friends.push(user_b.intraId);
      return this.saveUser(UserService.currentUser);
    }
    return of(UserService.currentUser);
  }

  mutualFriends(a: string | undefined, b: string | undefined) {
    if (!a || !b) return;
    let u_a = this.getUser(a);
    let u_b = this.getUser(b);
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

  getBlocks(u_user?: User): User[] | undefined {
    if (!u_user) return undefined;
    return this.intraIdsToUsers(u_user.blocks);
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
    if (!this.isBlock(user_b)) {
      UserService.currentUser.blocks.push(user_b.intraId);
      return this.saveUser(UserService.currentUser);
    }
    return of(UserService.currentUser);
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

  intraIdsToUsers(ulist: string[] | undefined): User[] | undefined {
    if (!ulist) return undefined;
    const out: User[] = [];
    for (const one of ulist) {
      const u = this.getUser(one);
      if (u) out.push(u);
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
      return of(result as T);
    };
  }
}
