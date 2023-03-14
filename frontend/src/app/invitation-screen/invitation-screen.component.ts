import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation, InviteState } from '../invitation';
import { ChatService } from '../chat.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	static state: InviteState[] = [];
	static connected: boolean = false;
	myState: InviteState|undefined = undefined
	clickGo?: boolean;

	constructor (
		private readonly chatService: ChatService,
		private readonly invitationService: InvitationService,
		private readonly fun: HelperFunctionsService,
		private readonly router: Router,
	){}

	ngOnInit() {
		//console.log("invite init");
		this.myState = InvitationScreenComponent.state[0];
		if (InvitationScreenComponent.connected) return;
		InvitationScreenComponent.connected = true;
		this.invitationService.inviteState.subscribe(_=>{
			if (_) {
				console.log("Inv component got news!", InvitationScreenComponent.state.length, _);
				if(	_.receiveScreen
				||	_.declineScreen
				||	_.acceptScreen
				||	_.sentScreen
				||	_.notificationScreen
				)	InvitationScreenComponent.state.push({
						receiveScreen : _.receiveScreen,
						declineScreen : _.declineScreen,
						acceptScreen : _.acceptScreen,
						sentScreen : _.sentScreen,
						notificationScreen : _.notificationScreen,
						invitation : _.invitation,
					});
				console.log("This is all:", InvitationScreenComponent.state.length, InvitationScreenComponent.state);
				this.myState = InvitationScreenComponent.state[0];
				console.log("My state A", this.myState);
				this.router.navigate([this.router.url]);
			}
		});
	}

	flip(): InviteState|undefined {
		let old = InvitationScreenComponent.state.shift();
		this.myState = InvitationScreenComponent.state[0];
		console.log("My state B", this.myState);
		console.log("flip returning", old);
		return old;
	}

	accept() {
//		console.log("Accept");
		let old = this.flip();
		if (old && old.invitation)
			this.invitationService.replyTrue(old.invitation);
	}

	decline() {
		console.log("Decline");
		let old = this.flip();
		if (old && old.invitation)
			this.invitationService.replyFalse(old.invitation);
	}

	finalOk() {
		let old = this.flip();
		if (!old) return;
		const go = (old.acceptScreen || old.notificationScreen) && this.clickGo;
		let route = go ? old.invitation?.route : null;
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

