import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { InvitationService } from '../invitation.service';

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
	loggedUser?: User;

	constructor(
		private userService: UserService,
		private readonly invitationService: InvitationService,
	){}

	checkMe() {
		this.userService.getLoggedUser().subscribe(_=>{
			this.loggedUser = _;
			this.isMe = _.intraId == this.user?.intraId;
		});
	}

	ngOnChanges() {
		this.checkFriendship();
		this.checkMe();
	}

	inviteToChat() {
		this.invitationService.inviteToChat(this.loggedUser?.intraId, this.user?.intraId);
	}

	checkFriendship() {
		this.isFriend=this.userService.isFriend(this.user)
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
