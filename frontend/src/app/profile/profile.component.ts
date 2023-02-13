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

	user: User = {} as User;
	owner: Boolean = false;
	profileType: string = "USER";
	id: string | undefined = undefined;

	ngOnInit(): void {
		//console.log("Profile Component Init");
		this.getUser();
	}
	getUser(): void {
		//console.log("Getting user");
		this.route.params.subscribe((params: Params) => {
			this.id = params['intraId'];
			//console.log("Got info from route.params.", this.id);
			if (this.id) {
				// TODO: Reject /profile/unexistent-user
				//console.log("You asked for", this.id);
				this.userService.getUserById(this.id)
					.subscribe(user => this.user = user);
				let ownership: User = {} as User;
				this.userService.getLoggedUser()
					.subscribe(user => { ownership = user });
				this.user = !this.user ? ownership : this.user;
				this.owner = ownership === this.user;
				this.profileType = (this.owner ? "YOUR" :
					this.isFriend() ? "FRIEND" : "USER");
			}
		});
		this.userService.getLoggedUser().subscribe(user => {
			//console.log("Got signal from getLoggedUser(). this.id = ", this.id);
			if (!this.id)
			{
				//console.log("!this.id", !this.id);
				this.user = user;
			}
		});
//		this.userService.getLoggedUser().subscribe(user => {
//			console.log("Signal from getLoggedUser()");
//			this.user = user;
//		});
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

