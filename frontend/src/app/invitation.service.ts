import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation, InviteState } from './invitation';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { User } from './user';
import { BehaviorSubject } from 'rxjs';
import { RoomsService } from './game/components/rooms/rooms.service';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  user?: User;
  receiveScreen = false;
  friendScreen = false;
  declineScreen = false;
  acceptScreen = false;
  sentScreen = false;
  notificationScreen = false;
  friendshipRequestString = 'Friendship Request';
  static inviteState: BehaviorSubject<InviteState | undefined> =
    new BehaviorSubject<InviteState | undefined>(undefined);

  constructor(
    private readonly router: Router,
    private readonly socket: InviteSocket,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
		private readonly roomsService: RoomsService,
  ) {
    this.getUser();
    this.doSubscription();
  }

  getUser(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
    });
  }

  doSubscription() {
    this.getInvitation().subscribe(_ => {
      if (
        _.payload.to == this.user?.intraId ||
        _.payload.from == this.user?.intraId
      ) {
        this.sentScreen =
          _.payload.from == this.user?.intraId && !_.payload.isReply;

        this.receiveScreen =
          _.payload.to == this.user?.intraId &&
          !_.payload.isReply &&
          !_.payload.note &&
          _.payload.type != this.friendshipRequestString;

        this.friendScreen =
          _.payload.to == this.user?.intraId &&
          !_.payload.isReply &&
          !_.payload.note &&
          _.payload.type == this.friendshipRequestString;

        this.declineScreen =
          _.payload.from == this.user?.intraId &&
          _.payload.isReply &&
          !_.payload.answer &&
          !_.payload.note;

        this.acceptScreen =
          _.payload.from == this.user?.intraId &&
          _.payload.isReply &&
          _.payload.answer &&
          !_.payload.instantaneous &&
          !_.payload.note;

        if (
          _.payload.from == this.user?.intraId &&
          _.payload.isReply &&
          _.payload.answer &&
          _.payload.instantaneous &&
          !_.payload.note
        )
          return this.go(_.payload.route);

        this.notificationScreen =
          _.payload.to == this.user?.intraId && !!_.payload.note;

        InvitationService.inviteState.next({
          receiveScreen: this.receiveScreen,
          friendScreen: this.friendScreen,
          declineScreen: this.declineScreen,
          acceptScreen: this.acceptScreen,
          sentScreen: this.sentScreen,
          notificationScreen: this.notificationScreen,
          invitation: _.payload,
        });

        if (this.notificationScreen && _.payload.routeBefore) {
          setTimeout(() => {
            return this.go(_.payload.route);
          }, 1000);
        }
      }
    });
  }

  invite(u_invite: Invitation) {
    this.socket.emit('invitation', u_invite);
  }

  notify(u_notification: Invitation) {
    this.invite(u_notification);
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  sendReply(invite: Invitation) {
    invite.isReply = true;
    this.socket.emit('invitation', invite);
    if (invite.route && invite.answer) this.go(invite.route);
  }

  replyTrue(invite: Invitation | undefined) {
    if (!invite) return;
    invite.answer = true;
    this.sendReply(invite);
  }

  replyFalse(invite: Invitation | undefined) {
    if (!invite) return;
    invite.answer = false;
    this.sendReply(invite);
  }

  getInvitation() {
    return this.socket.fromEvent<any>('invitation');
  }

  async invitePrivateChat(from: string, to: string) {
    const [newRoomId, newRoomName] = await this.chatService.newRoom([from, to]);
    this.invite({
      from: from,
      to: to,
      type: 'PRIVATE CHAT: ' + newRoomName,
      route: '/chat/' + newRoomId,
      instantaneous: false,
    });
  }

  async invitePrivateMatch(from: string, to: string) {
    let link = await this.roomsService.getLastLink();
    this.invite({
      from: from,
      to: to,
      type: 'A MATCH! ' + link,
      route: link,
      instantaneous: false,
    });
  }

  async friendshipRequest(from: string, to: string) {
    this.invite({
      from: from,
      to: to,
      type: this.friendshipRequestString,
    });
  }

  mutualFriends(a: string | undefined, b: string | undefined) {
    this.userService.mutualFriends(a, b);
  }
}
