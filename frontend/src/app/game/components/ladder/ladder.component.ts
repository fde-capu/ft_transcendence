import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/user';
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
  @Input() userId?: string;
	isMe?: boolean;
  constructor(
    private http: HttpClient,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.getLadderOnce();
		this.getMyself();
  }

	ngOnChanges() {
		this.getMyself();
	}

	async getMyself() {
    this.authService
      .getAuthContext()
      .subscribe({ next: ctx => 
				{
					if (!this.userId)
						this.userId = ctx!.sub;
					this.isMe = this.userId == ctx!.sub;
				} });
	}

  async getLadderOnce(): Promise<void> {
    this.getLadder().subscribe(_ => {
			//console.log("gotLadder", _);
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

	myHeight(n: number) {
		return n * 500 / this.maxScore;
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
