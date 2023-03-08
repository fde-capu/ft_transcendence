import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
selector: 'app-avatar',
templateUrl: './avatar.component.html',
styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
	@Input() user?: User;
	popUpOn = false;
	isFriend: boolean = false;

	constructor(
		private userService: UserService
	){}

	ngOnChanges() {
		this.checkFriendship();
	}

	checkFriendship() {
			this.isFriend=
		this.userService.isFriend(this.user)
	}

	onClick(): void {
		this.popUpOn = this.popUpOn ? false : true;
	}

	makeFriend(){
		this.userService.makeFriend(this.user).subscribe();
	}

	unFriend(){
		this.userService.unFriend(this.user).subscribe();
	}

	onHover(): void {
		const self = this;
		this.popUpOn = true;
		function repeat(){
			setTimeout(function() {
				return self.popUpOn ? repeat() : false;
			}, 300);
		}; repeat();
	}

	onHoverOut(): void {
		this.popUpOn = false;
	}
}
