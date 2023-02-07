import { Component } from '@angular/core';
import { User } from '../user';
import { USERS } from '../mocks';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	user: User = {} as User;
	owner: Boolean = false;

	constructor (
		private userService: UserService,
		private route: ActivatedRoute,
		private location: Location,
		public fun: HelperFunctionsService
	) {};
	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		this.route.params.subscribe((params: Params) => {
			var id = params['intraId'];
			this.userService.getUserById(id)
				.subscribe(user => this.user = user);
			var ownership: User = {} as User;
			this.userService.getLoggedUser()
				.subscribe(user => { ownership = user });
			this.owner = ownership === this.user;
		})
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
