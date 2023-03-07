import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation } from './invitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(
	private readonly socket: InviteSocket,
  ) {
	console.log("Invite service constructor");
	}

	sendReply(invite: Invitation) {
		console.log("Sendind reply:", invite);
		this.socket.emit('invitation', invite);
	}

	getInvitation() {
		console.log("Invite service getting from socket.");
		return this.socket.fromEvent<any>('invitation');
	}
}
