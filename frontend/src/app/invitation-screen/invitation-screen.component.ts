import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation';
import { UserService } from '../user.service';
import { ChatService } from '../chat.service';
import { User } from '../user';
import { HelperFunctionsService } from '../helper-functions.service';


@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	invite: Invitation[] = [];
	lastInvite?: Invitation;
	user?: User;
	receiveScreen?: boolean;
	declineScreen?: boolean;
	acceptScreen?: boolean;
	sentScreen?: boolean;
	notificationScreen?: boolean;
	clickGo?: boolean;

	constructor (
		private readonly userService: UserService,
		private readonly chatService: ChatService,
		private readonly invitationService: InvitationService,
		private readonly fun: HelperFunctionsService,
	){}

	ngOnInit() {
		//console.log("invite init");
		this.getUser();
		this.socketSubscription();
	}

	getUser(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => { this.user = backUser; }
		)
	}

	socketSubscription() {
		//console.log("Invitation subscribing.");
		this.invitationService.getInvitation().subscribe(
			_ => {
				//console.log("Invitation subscription got", _);
				if (_.payload.to == this.user?.intraId || _.payload.from == this.user?.intraId) 
				{
					this.sentScreen = _.payload.from == this.user?.intraId
						&& !_.payload.isReply
					this.receiveScreen = _.payload.to == this.user?.intraId
						&& !_.payload.isReply
						&& !_.payload.note
					this.declineScreen = _.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& !_.payload.answer
						&& !_.payload.note
					this.acceptScreen = _.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& _.payload.answer
						&& !_.payload.instantaneous
						&& !_.payload.note
					if (_.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& _.payload.answer
						&& _.payload.instantaneous
						&& !_.payload.note
						) return this.invitationService.go(_.payload.route);
					this.notificationScreen = _.payload.to == this.user?.intraId
						&& !!_.payload.note;
					//console.log("Pushing notification", _.payload);
					this.invite.push(_.payload)
					// ^ This flips the screen so any code below is not run.
				}
			},
		);
	}

	accept() {
		this.finish();
		if (!this.lastInvite) return;
		this.invitationService.replyTrue(this.lastInvite);
	}

	decline() {
		this.finish();
		if (!this.lastInvite) return;
		this.invitationService.replyFalse(this.lastInvite);
		this.receiveScreen = false;
	}

	finish() {
		//console.log("Shifting");
		this.lastInvite = this.invite.shift();
	}

	finalOk() {
		//console.log("Turning off screen.");
		this.finish();
		if (!this.lastInvite) return;
		const go = (this.acceptScreen || this.notificationScreen) && this.clickGo;
		this.clickGo = false;
		this.receiveScreen = false;
		this.declineScreen = false;
		this.acceptScreen = false;
		this.sentScreen = false;
		this.notificationScreen = false;
		if (go)
			this.invitationService.go(this.lastInvite.route);
	}

	 mockInvite() {
		this.invitationService.invite(
			{
				from: 'fde-capu',
				to: 'mockUser',
				type: 'Go to the chatroom lobby (/rooms).',
				route: '/rooms',
				isReply: false
			}
		);
	 }

	 mockDecline() {
		this.invitationService.invite(
			{
				from: 'fde-capu',
				to: 'mockUser',
				type: 'Go to the chatroom lobby (/rooms).',
				route: '/rooms',
				isReply: true,
				answer: false
			}
		);
	 }

	 mockAccept() {
		this.invitationService.invite(
			{
				from: 'fde-capu',
				to: 'mockUser',
				type: 'Go to the chatroom lobby (/rooms).',
				route: '/rooms',
				isReply: true,
				answer: true
			}
		);
	 }


	 mockAcceptInstantaneous() {
		this.invitationService.invite(
			{
				from: 'fde-capu',
				to: 'mockUser',
				type: 'Go to the chatroom lobby (/rooms).',
				route: '/rooms',
				isReply: true,
				answer: true,
				instantaneous: true
			}
		);
	 }

	 mockReceive() {
		this.invitationService.invite(
			{
				from: 'mockUser',
				to: 'fde-capu',
				type: 'Go to the chatroom lobby (/rooms).',
				route: '/rooms',
				isReply: false
			}
		);
	 }
}
