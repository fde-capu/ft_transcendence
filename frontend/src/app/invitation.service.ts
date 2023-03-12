import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation } from './invitation';
import { Router } from '@angular/router';
import { HelperFunctionsService } from './helper-functions.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(
		private readonly router: Router,
		private readonly socket: InviteSocket,
		private readonly fun: HelperFunctionsService,
  ) {
		//console.log("Invite service constructor");

	}

	invite(u_invite: Invitation) {
		//console.log("Sendind invitation:", u_invite);
		this.socket.emit('invitation', u_invite);
		return true;
	}

	go(path: string) {
		this.router.navigate([path]);
	}

	sendReply(invite: Invitation) {
		invite.isReply = true;
		//console.log("Sendind reply:", invite);
		this.socket.emit('invitation', invite);
		if (invite.answer)
			this.go(invite.route);
	}

	replyTrue(invite: Invitation) {
		invite.answer = true;
		this.sendReply(invite);
	}

	replyFalse(invite: Invitation) {
		invite.answer = false;
		this.sendReply(invite);
	}

	getInvitation() {
		//console.log("Invite service getting from socket.");
		return this.socket.fromEvent<any>('invitation');
	}

	inviteToPrivateChat(from: string = "", to: string = "") {
		console.log("Inviting", from, to);
		this.invite({
			from: from,
			to: to,
			type: "PRIVATE CHAT: " + from + " | " + to,
			route: "/chat",
			instantaneous: true,
			isReply: false
		});
	}
}
