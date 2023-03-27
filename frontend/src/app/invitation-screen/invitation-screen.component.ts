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
		this.myState = InvitationScreenComponent.state[0];
		if (InvitationScreenComponent.connected) return;
		InvitationScreenComponent.connected = true;
		//console.log("Will subscribe.");
		const subscription = InvitationService.inviteState.subscribe(_=>{
			if (_) {
				//console.log("Invitation subscription.", _);
				if (_.receiveScreen
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
				this.router.navigate([this.router.url]);
			}
		});
	}

	flip(): InviteState|undefined {
		let old = InvitationScreenComponent.state.shift();
		this.myState = InvitationScreenComponent.state[0];
		return old;
	}

	accept() {
		let old = this.flip();
		if (old && old.invitation)
			this.invitationService.replyTrue(old.invitation);
	}

	decline() {
		let old = this.flip();
		if (old && old.invitation)
			this.invitationService.replyFalse(old.invitation);
	}

	alreadyInRoute(): boolean {
		let route = this.myState?.invitation?.route;
		return route == this.router.url;
	}

	finalOk() {
		let old = this.flip();
		if (!old) return;
		const go = (old.acceptScreen || old.notificationScreen) && this.clickGo;
		let route = go ? old.invitation?.route : null;
		if (go && route && !this.alreadyInRoute())
			this.invitationService.go(route);
	}
}
