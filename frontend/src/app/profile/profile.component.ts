import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';
import { catchError } from 'rxjs/operators';
import { LoginComponent } from '../login/components/login/login.component';
import { LoginModule } from '../login/login.module';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(
    private userService: UserService,
    public fun: HelperFunctionsService,
    private route: ActivatedRoute,
    private loginComponent: LoginComponent,
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {}

  user: User | undefined = undefined;
  displayUser: User | undefined = undefined;
  idRequest!: string;
  owner: Boolean = false;
  profileType: string = 'USER';
  isFriend: boolean = false;
  isBlock: boolean = false;
  amIBlocked?: boolean;
  invalidNameNotice: boolean = false;
  lastName: string = '';
  lastPassword?: string;
  mfaOpened?: boolean;
	static editing: boolean = false;
  imageError?: string;

  ngOnInit(): void {
    this.getUser();
		this.getIdRequest();
		this.getDisplayUser();
  }

  async getUser() {
		this.user = UserService.currentUser;
    await new Promise(resolve => setTimeout(resolve, 111));
		this.getUser();
  }

  async getIdRequest() {
    this.route.params.subscribe((params: Params) => {
      this.idRequest = params['intraId'];
    });
    await new Promise(resolve => setTimeout(resolve, 111));
		this.getIdRequest();
  }

  async getDisplayUser() {
		if (!this.idRequest) {
			this.displayUser = this.user;
			this.setOwnership();
		} else {
			if (!ProfileComponent.editing)
				this.displayUser = this.userService.getUser(this.idRequest);
			this.setOwnership();
			this.amIBlocked = this.userService.amIBlocked(this.displayUser);
		}
    await new Promise(resolve => setTimeout(resolve, 222));
		this.getDisplayUser();
  }

  async setOwnership() {
    if (!this.user) return;
    this.isFriend = this.userService.isFriend(this.displayUser);
    this.isBlock = this.userService.isBlock(this.displayUser);
    this.owner = this.user.intraId == this.displayUser?.intraId;
    this.profileType = this.isBlock ? 'BLOCKED ' : '';
    this.profileType += this.owner ? 'YOUR' : this.isFriend ? 'FRIEND' : 'USER';
    this.profileType += this.amIBlocked ? ' BLOCKED YOU' : '';
  }

  switchMfa() {
    if (this.displayUser) {
      this.displayUser.mfa_enabled = !this.displayUser.mfa_enabled;
      if (this.displayUser.mfa_enabled) this.mfaOpened = true;
      else this.saveUser();
    }
  }

	solveChallenge(form: NgForm) {
		this.loginComponent.solveChallenge(form);
	}

  async validateAndSaveUser() {
    if (!this.displayUser) return;
    if (this.fun.validateString(this.displayUser.name)) {
			this.saveUser();
    } else {
      this.invalidNameNotice = true;
      await this.fun.blink3('invalidNameNotice');
      this.invalidNameNotice = false;
      this.displayUser.name = this.lastName;
      this.fun.focus('invalidNameNotice');
    }
  }

  saveLastName() {
    const save = this.displayUser?.name;
    this.lastName = save ? save : '';
  }

  saveUser() {
		ProfileComponent.editing = true;
    if (this.displayUser) {
      this.userService
        .saveUser(this.displayUser)
        .subscribe(_=>{this.unsetEditing();});
    }
  }

  upload(file: HTMLInputElement) {
    if (!file || !file.files || !file.files.length) {
			this.fun.blink3('file');
			return;
		}
    const fd = new FormData();
    fd.append('file', file.files[0], file.files[0].name);
    this.httpClient
      .post<void>(`${environment.BACKEND_ORIGIN}/user/profile/image`, fd, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.imageError = undefined;
          this.router.navigateByUrl(this.router.url);
        },
        error: err => (this.imageError = err.error['message']),
      });
  }

	setEditing() {
		ProfileComponent.editing = true;
	}

	unsetEditing() {
		setTimeout(() => {
			ProfileComponent.editing = false;
		}, 2555);
	}
}
