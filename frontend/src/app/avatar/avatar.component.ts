import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError, of } from 'rxjs';

@Component({
selector: 'app-avatar',
templateUrl: './avatar.component.html',
styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
	@Input() user?: User;
	popUpOn?: boolean;
	isFriend: boolean = false;
	isBlock: boolean = false;
	isMe: boolean = false;
	amIBlocked?: boolean;
	@Input() positionbottom?: boolean;

	constructor(
		private userService: UserService,
	){}

	ngOnChanges() {
		this.checkFriendship();
		this.checkBlock();
	}

	checkFriendship() {
		this.isFriend=this.userService.isFriend(this.user)
	}

	checkBlock() {
		this.isBlock=this.userService.isBlock(this.user)
		this.amIBlocked=this.userService.amIBlocked(this.user);
	}

	onClick(): void {
		this.popUpOn = !this.popUpOn;
	}

	async onHover() {
		this.popUpOn = true;
	}

	onHoverOut(): void {
		this.popUpOn = false;
	}
}
