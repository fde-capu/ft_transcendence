import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation } from './invitation';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  constructor(
    private readonly router: Router,
    private readonly socket: InviteSocket
  ) {}

  invite(u_invite: Invitation): boolean {
    this.socket.emit('invitation', u_invite);
    return true;
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  sendReply(invite: Invitation) {
    invite.isReply = true;
    this.socket.emit('invitation', invite);
    if (invite.answer) this.go(invite.route);
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
    return this.socket.fromEvent<{
      author: string;
      payload: Invitation;
    }>('invitation');
  }
}
