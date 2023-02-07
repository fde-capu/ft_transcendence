import { Component, Input, ElementRef } from '@angular/core';
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
	constructor (
		private userService: UserService,
		private route: ActivatedRoute,
		private location: Location,
		public fun: HelperFunctionsService,
		public elementRef: ElementRef
	) {};

	owner: Boolean = false;
	@Input() user!: User;
	windowName: string = "";
	windowExtras: string = "USER||FRIEND||SELF:"; // TODO: unmock
	borderless: Boolean = false;

	ngOnInit(): void {
		if (!this.user)
		{
			this.getUser();
			this.borderless = true;
		}
		else
		{
			var ownership: User = {} as User;
			this.userService.getLoggedUser()
				.subscribe(user => { ownership = user });
			this.owner = ownership === this.user;
			this.imprint();
		}
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
			this.imprint();
		})
	}
	onClose() {
		alert('Closes this profile.');
	}
	isFriend(): Boolean {
		return this.userService.isFriend(this.user);
	}
	imprint() {
		if (!this.user)
			return ;
		this.windowExtras = (this.owner ? "SELF" :
			this.isFriend() ? "FRIEND" : "USER") + ":";
		this.windowName = this.user.name;
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
