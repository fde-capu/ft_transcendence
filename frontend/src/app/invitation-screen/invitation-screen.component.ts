import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation, InviteState } from '../invitation';
import { ChatService } from '../chat.service';
import { HelperFunctionsService } from '../helper-functions.service';


@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	receiveScreen: boolean = false;
	declineScreen: boolean = false;
	acceptScreen: boolean = false;
	sentScreen: boolean = false;
	notificationScreen: boolean = false;
	invitation: Invitation = {} as Invitation;

	clickGo?: boolean;

	constructor (
		private readonly chatService: ChatService,
		private readonly invitationService: InvitationService,
		private readonly fun: HelperFunctionsService,
	){}

	ngOnInit() {
		//console.log("invite init");
		this.invitationService.inviteState.subscribe(_=>{
			if (_) {
				console.log("Inv component got news!", _);
				this.receiveScreen = _.receiveScreen;
				this.declineScreen = _.declineScreen;
				this.acceptScreen = _.acceptScreen;
				this.sentScreen = _.sentScreen;
				this.notificationScreen = _.notificationScreen;
				this.invitation = _.invitation;
				console.log("This is invite:", this.invitation);
			}
		});
	}

	accept() {
		this.invitationService.replyTrue(this.invitation);
		this.invitationService.finish();
	}

	decline() {
		this.invitationService.replyFalse(this.invitation);
		this.invitationService.finish();
	}

	finalOk() {
		const go = (this.acceptScreen || this.notificationScreen) && this.clickGo;
		let route = go ? this.invitation.route : null;
		this.invitationService.finish();
		if (go && route)
			this.invitationService.go(route);
	}

	// Only mocks from here.
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

