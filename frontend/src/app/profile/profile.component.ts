import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';
import { catchError } from 'rxjs/operators';
import { LoginComponent } from '../login/components/login/login.component';
import { LoginModule } from '../login/login.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent {
	constructor (
		private userService: UserService,
		public fun: HelperFunctionsService,
		private route: ActivatedRoute,
		private loginComponent: LoginComponent,
	) {};

	user: User | undefined = undefined;
	displayUser: User | undefined = undefined;
	idRequest!: string;
	owner: Boolean = false;
	profileType: string = "USER";
	isFriend: boolean = false;
	isBlock: boolean = false;
	amIBlocked?: boolean;
	invalidNameNotice: boolean = false;
	lastName: string = "";
	lastPassword?: string;
	mfaOpened?: boolean;

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
      this.userService.setStatus('ONLINE');
      this.getIdRequest();
    });
  }

  getIdRequest() {
    this.route.params.subscribe((params: Params) => {
      this.idRequest = params['intraId'];
      this.getDisplayUser();
    });
  }

  async getDisplayUser() {
    if (this.owner || !this.userService.authorized()) return;
    if (!this.idRequest) {
      this.displayUser = this.user;
      this.setOwnership();
      return;
    }
    this.userService
      .getUserById(this.idRequest)
      .pipe(catchError(this.userService.handleError<any>('getDisplayUser')))
      .subscribe(backUser => {
        if (backUser) this.displayUser = backUser;
        else this.displayUser = undefined;
        // ^ Above seems redundant but condition is needed.
        this.setOwnership();
        this.amIBlocked = this.userService.amIBlocked(this.displayUser);
      });
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
			if (this.displayUser.mfa_enabled)
				this.mfaOpened = true;
			else
				this.saveUser();
		}
	}

	solveChallenge(form: NgForm) {
		this.loginComponent.solveChallenge(form);
	}

  async validateAndSaveUser() {
    if (!this.displayUser) return;
    if (this.fun.validateString(this.displayUser.name)) this.saveUser();
    else {
      this.invalidNameNotice = true;
      this.fun.blink('invalidNameNotice');
      await new Promise(resolve => setTimeout(resolve, 342));
      this.fun.blink('invalidNameNotice');
      await new Promise(resolve => setTimeout(resolve, 342));
      this.fun.blink('invalidNameNotice');
      await new Promise(resolve => setTimeout(resolve, 342));
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
    if (this.displayUser) {
      this.userService
        .saveUser(this.displayUser)
        .subscribe({ next: () => ({}) });
    }
  }
}
