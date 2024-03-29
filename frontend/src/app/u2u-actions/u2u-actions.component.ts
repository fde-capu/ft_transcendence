import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { InvitationService } from '../invitation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-u2u-actions',
  templateUrl: './u2u-actions.component.html',
  styleUrls: ['./u2u-actions.component.css'],
})
export class U2uActionsComponent implements OnChanges {
  @Input() isFriend?: boolean;
  @Input() isBlock?: boolean;
  @Input() user?: User;
  @Input() caption?: boolean;
  @Input() singleline?: boolean;
  @Input() amIBlocked?: boolean;
	@Input() tinyForChat?: boolean;
  isMe?: boolean;
  availability?: boolean;
	messageDelay?: boolean;

	constructor(
		private userService: UserService,
		private readonly invitationService: InvitationService,
		private readonly router: Router,
	){}

  ngOnChanges() {
    this.checkMe();
    this.availability =
      this.user?.status != 'OFFLINE' && this.user?.status != 'INGAME';
  }

  inviteToChat() {
		if (this.messageDelay) return;
    const myId = this.userService.getQuickIntraId();
    if (!myId || !this.user) return;
    this.invitationService.invitePrivateChat(myId, this.user.intraId);
		this.messageDelay = true;
		setTimeout(() => {
			this.messageDelay = false;
		}, 5000);
  }

  inviteToMatch() {
    const myId = this.userService.getQuickIntraId();
    if (!myId || !this.user) return;
    this.invitationService.invitePrivateMatch(myId, this.user.intraId);
  }

	makeFriend(){
		const myId = this.userService.getQuickIntraId();
		if (!myId || !this.user) return;
		this.invitationService.friendshipRequest(myId, this.user.intraId);
	}

  unFriend() {
		this.isFriend = false;
    this.userService.unFriend(this.user).subscribe();
  }

  makeBlock() {
		this.isBlock = true;
    this.userService.makeBlock(this.user).subscribe();
  }

  unBlock() {
		this.isBlock = false;
    this.userService.unBlock(this.user).subscribe();
  }

	checkMe() {
		this.isMe = UserService.currentIntraId == this.user?.intraId;
	}

	goToProfile() {
		this.router.navigate(['/profile/' + this.user?.intraId]);
	}
}
