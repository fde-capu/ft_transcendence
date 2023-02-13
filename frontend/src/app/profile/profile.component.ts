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

	loggedUser: User | undefined = undefined;
	user: User | undefined = undefined;
	owner: Boolean = false;
	profileType: string = "USER";

	ngOnInit(): void {
		//console.log("Profile Component Init");
		this.getUser();
	}
	getUser(): void {
		//console.log("Getting user");
		this.route.params.subscribe((params: Params) => {
			const id = params['intraId'];
			//console.log("Got info from route.params.", id, id != undefined);
			if (id != undefined) {
				// TODO: Reject /profile/unexistent-user
				//console.log("You asked for", id);
				this.userService.getUserById(id)
					.subscribe(user => {
						//console.log("Seting to ", user);
						this.user = user ? user : undefined;
						this.setOwnership();
					});
			}
		});
		this.userService.getLoggedUser().subscribe(user => {
			//console.log("Got signal from getLoggedUser(): ", user.intraId);
			this.loggedUser = user;
			this.setOwnership();
		});
	}
	setOwnership() {
		//console.log("setOwnership; logged, called:", this.loggedUser, this.user);
		this.owner = !this.user || this.loggedUser?.intraId === this.user.intraId && (!!this.user || !!this.loggedUser);
		this.user = this.user ? this.user : this.loggedUser;
		//console.log("This owner", this.owner);
		this.profileType = (this.owner ? "YOUR" : this.isFriend() ? "FRIEND" : "USER");
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

