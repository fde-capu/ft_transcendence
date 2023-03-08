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
	getDisplayUser() {
		//console.log("idRequest", this.idRequest);
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
			}
		)
	}
	async setOwnership() {
		if (!this.user)
			return ;
		this.owner = this.user.intraId == this.displayUser?.intraId;
		this.profileType = this.owner ? "YOUR" : this.isFriend() ? "FRIEND" : "USER";
	}
	isFriend(): boolean {
		return this.userService.isFriend(this.displayUser);
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

// TODO:
// Match history:
//   :: all played games, ladder, anything useful.
//      - stated must be visible to all logged users.
// Friends list (show online/offline, in game etc).
//   :: I gess "in game" info doesn't need friendship.

// - Implement user score.
