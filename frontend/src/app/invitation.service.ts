import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation } from './invitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(
	private readonly socket: InviteSocket,
  ) { }

	sendReply(invite: Invitation) {
		this.socket.emit('invitation', invite);
	}

	getInvitation() {
		return this.socket.fromEvent<any>('invitation');
	}
}
