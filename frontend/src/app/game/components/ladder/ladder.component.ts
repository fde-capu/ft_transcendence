import { Component, Input, OnInit } from '@angular/core';
//import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/user';
//import { HelperFunctionsService } from '../../../helper-functions.service';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css'],
})
export class LadderComponent implements OnInit {
  private allUsersUrl = `${environment.backendOrigin}/user/online`;
	// TODO ^ Make endport for getting all users.
  maxScore = 0;
  ladder: any[] = [];
  userId!: string;
  @Input() them?: User;
  constructor(
    private http: HttpClient,
    private readonly authService: AuthService
//    private readonly userService: UserService,
//    private readonly fun: HelperFunctionsService
  ) {
    this.authService
      .getAuthContext()
      .subscribe({ next: ctx => (this.userId = ctx!.sub) });
	}

  ngOnInit() {
    this.getLadderOnce();
  }

  async getLadderOnce(): Promise<void> {
    this.getLadder().subscribe(_ => {
			console.log("getLadder got", _);
      this.ladder = _;
      this.ladder.sort(function (a: any, b: any) {
        return b.score - a.score;
      });
      let i = 0;
      for (const s of this.ladder) {
        s.position = ++i;
        this.maxScore = s.score >= this.maxScore ? s.score : this.maxScore;
      }
    });
  }

  getLadder(): Observable<any[]> {
    return this.http
      .get<User[]>(this.allUsersUrl, { withCredentials: true })
      .pipe(catchError(this.handleError<User[]>('getAllUsers', [])));
  }

  async showMyself() {
    const exist = document.getElementById('focusMe');
    if (exist) exist.focus();
    this.blink3('focusMe');
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('ERROR:::', error.error.statusCode, operation);
      return of(result as T);
    };
  }

  blink(el: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    exist.classList.add('inverted');
    setTimeout(function () {
      exist.classList.remove('inverted');
    }, 200);
  }
  async blink3(el: string) {
    this.blink(el);
    await new Promise(resolve => setTimeout(resolve, 355));
    this.blink(el);
    await new Promise(resolve => setTimeout(resolve, 355));
    this.blink(el);
  }
}
