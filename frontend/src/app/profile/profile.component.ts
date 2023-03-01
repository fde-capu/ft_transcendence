import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';

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
				console.log("profile got logged user.", backUser);
				this.user = backUser;
				this.getIdRequest();
			}
		)
	}
	getIdRequest() {
		this.route.params.subscribe((params: Params) => {
			this.idRequest = params['intraId'];
			this.getDisplayUser();
		});
	}
	getDisplayUser() {
		console.log("idRequest", this.idRequest);
		if (!this.idRequest)
		{
			this.displayUser = this.user;
			this.setOwnership();
			return ;
		}
		this.userService.getUserById(this.idRequest).subscribe(
			backUser => { 
				console.log("profile got display user.", backUser);
				this.displayUser = backUser;
				this.setOwnership();
			}
		)
	}
	setOwnership() {
		if (!this.user || !this.displayUser)
			return ;
		this.owner = this.user.intraId == this.displayUser.intraId;
		this.profileType = this.owner ? "YOUR" : this.isFriend() ? "FRIEND" : "USER";
	}

	onClose() {
		alert('Closes this profile.');
	}
	isFriend(): Boolean {
		return this.userService.isFriend(this.user);
	}
}

// TODO:

// Put 2FA option on profile.
// Statistics (must be in user profile)
//   :: wins/looses, ladder, achievements etc. (+goals, +time playing)
//      -? visible to all logged users?
// Match history:
//   :: all played games, ladder, anything useful.
//      - stated must be visible to all logged users.
// Friends list (show online/offline, in game etc).
//   :: I gess "in game" info doesn't need friendship.

// - Implement user score.
