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
	displayUser?: User;
	popUpOn = false;
	isFriend: boolean = false;
	isMe: boolean = false;
	loggedUser?: User;

	constructor(
		private userService: UserService,
		private readonly invitationService: InvitationService,
	){}

	ngOnChanges() {
		this.checkFriendship();
		this.checkMe();
		this.updateMe();
	}

	async updateMe() {
		if (!this.user)
		{
			await new Promise(resolve => setTimeout(resolve, 1000));
			await this.updateMe();
		}
		else // Because no `return` above, so have to trick TS.
		{
			this.userService.getUser(this.user.intraId).subscribe(_=>{
				this.displayUser = _;
			});
			// Lazy update every 15 seconds, because there are many instances of avatars.
			// Note: chat messages do not update retroactively, but take changes from point on.
			await new Promise(resolve => setTimeout(resolve, 15000));
			await this.updateMe();
		}
	}

	checkMe() {
		this.userService.getLoggedUser().subscribe(_=>{
			this.loggedUser = _;
			this.isMe = _.intraId == this.user?.intraId;
		});
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
