import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'app-u2u-actions',
  templateUrl: './u2u-actions.component.html',
  styleUrls: ['./u2u-actions.component.css']
})
export class U2uActionsComponent {
	@Input() isFriend?: boolean;
	@Input() isBlock?: boolean;
	@Input() user?: User;
	@Input() caption?: boolean;
	@Input() singleline?: boolean;
	@Input() amIBlocked?: boolean;
	isMe: boolean = false;
	availability?: boolean;

	constructor(
		private userService: UserService,
		private readonly invitationService: InvitationService,
	){}

	ngOnChanges() {
		this.checkMe();
		console.log("u2u", this.user);
		this.availability = this.user?.status != 'OFFLINE' && this.user?.status != 'INGAME';
	}

	inviteToChat() {
		let myId = this.userService.getQuickIntraId();
		if (!myId || !this.user) return;
		this.invitationService.invitePrivate(myId, this.user.intraId);
	}

	makeFriend(){
		this.userService.makeFriend(this.user).subscribe();
	}

	unFriend(){
		this.userService.unFriend(this.user).subscribe();
	}

	makeBlock(){
		this.userService.makeBlock(this.user).subscribe();
	}

	unBlock(){
		this.userService.unBlock(this.user).subscribe();
	}

	checkMe() {
		this.userService.getLoggedUser().subscribe(_=>{
			this.isMe = _.intraId == this.user?.intraId;
		});
	}
}
