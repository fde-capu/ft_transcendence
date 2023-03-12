import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation } from './invitation';
import { Router } from '@angular/router';
import { HelperFunctionsService } from './helper-functions.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(
		private readonly router: Router,
		private readonly socket: InviteSocket,
		private readonly fun: HelperFunctionsService,
		private readonly chatService: ChatService,
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

	invitePrivate(from: string, to: string) {
		let newRoomId = this.fun.randomWord(128);
		let newRoomName = this.fun.funnyName();
		this.chatService.newRoom({
			id: newRoomId,
			name: newRoomName,
			user: [from, to],
			admin: [from, to],
			isPrivate: true
		});
		console.log("Inviting", from, to);
		this.invite({
			from: from,
			to: to,
			type: "PRIVATE CHAT: " + newRoomName,
			route: "/chat/" + newRoomId,
			instantaneous: true,
			isReply: false
		});
	}
}
