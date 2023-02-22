import { Component, Input } from '@angular/core';
import { User } from '../user';
import { USERS } from '../mocks';
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
		private route: ActivatedRoute,
		public fun: HelperFunctionsService,
	) {};

	user: User = {} as User;
	owner: Boolean = false;
	profileType: string = "USER";

	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		this.route.params.subscribe((params: Params) => {
			const id = params['intraId'];
			this.userService.getUserById(id)
				.subscribe(user => this.user = user);
			let ownership: User = {} as User;
			this.userService.getLoggedUser()
				.subscribe(user => { ownership = user });
			this.user = !this.user ? ownership : this.user;
			this.owner = ownership === this.user;
			this.profileType = (this.owner ? "YOUR" :
				this.isFriend() ? "FRIEND" : "USER");
		})
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
