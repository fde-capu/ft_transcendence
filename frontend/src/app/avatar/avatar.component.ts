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
	isMe: boolean = false;

	constructor(
		private userService: UserService
	){}

	checkMe() {
		this.userService.getLoggedUser().subscribe(_=>{
			this.isMe = _.intraId == this.user?.intraId;
		});
	}

	ngOnChanges() {
		this.checkFriendship();
		this.checkMe();
	}

	checkFriendship() {
		this.isFriend=this.userService.isFriend(this.user)
	}

	onClick(): void {
		this.popUpOn = this.popUpOn ? false : true;
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
