import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	constructor (
		private userService: UserService,
		public fun: HelperFunctionsService,
		private route: ActivatedRoute,
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

	ngOnInit(): void {
		//console.log("Profile Component Init");
		this.getUser();
	}
	getUser(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => { 
				//console.log("profile got logged user.", backUser);
				this.user = backUser;
				this.getIdRequest();
			}
		)
	}
	getIdRequest() {
		this.route.params.subscribe((params: Params) => {
			this.idRequest = params['intraId'];
			//console.log("profile got idReuqest", this.idRequest);
			this.getDisplayUser();
		});
	}
	async getDisplayUser() {
		//console.log("getDisplayUser", this.idRequest);
		if (this.owner) return;
		if (!this.idRequest)
		{
			this.displayUser = this.user;
			this.setOwnership();
			//console.log("profile set displayUser = user");
			return ;
		}
		this.userService.getUserById(this.idRequest).subscribe(
			backUser => { 
				//console.log("profile got display user:", backUser);
				if (backUser)
					this.displayUser = backUser;
				else
					this.displayUser = undefined;
				// ^ Above seems redundant but condition is needed.
				//console.log("new displayUser:", this.displayUser);
				this.setOwnership();
				this.amIBlocked=this.userService.amIBlocked(this.displayUser);
			}
		)
		await new Promise(resolve => setTimeout(resolve, 3007));
		await this.getDisplayUser();
	}

	async setOwnership() {
		if (!this.user)
			return ;
		this.isFriend = this.userService.isFriend(this.displayUser);
		this.isBlock = this.userService.isBlock(this.displayUser);
		this.owner = this.user.intraId == this.displayUser?.intraId;
		this.profileType = this.isBlock ? "BLOCKED " : "";
		this.profileType += this.owner ? "YOUR" : this.isFriend ? "FRIEND" : "USER";
		this.profileType += this.amIBlocked ? " BLOCKED YOU" : "";
	}

	async validateAndSaveUser() {
		if (!this.displayUser) return ;
		if (this.fun.validateString(this.displayUser.name))
			this.saveUser();
		else {
			this.invalidNameNotice = true;
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.invalidNameNotice = false;
			this.fun.focus('invalidNameNotice');
		}
	}

	saveUser() {
		if (this.displayUser)
			this.userService.saveUser(this.displayUser).subscribe();
	}

	switchMfa() {
		if (this.displayUser)
			this.displayUser.mfa_enabled = !this.displayUser.mfa_enabled;
		this.saveUser();
	}
}
