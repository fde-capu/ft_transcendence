import { Injectable } from '@angular/core';
import { InviteSocket } from './invite.socket';
import { Invitation, InviteState } from './invitation';
import { Router } from '@angular/router';
import { HelperFunctionsService } from './helper-functions.service';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { User } from './user';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
	user?: User;
	receiveScreen: boolean = false;
	declineScreen: boolean = false;
	acceptScreen: boolean = false;
	sentScreen: boolean = false;
	notificationScreen: boolean = false;
	inviteState: BehaviorSubject<InviteState|undefined> = new BehaviorSubject<InviteState|undefined>(undefined);

  constructor(
		private readonly router: Router,
		private readonly socket: InviteSocket,
		private readonly fun: HelperFunctionsService,
		private readonly chatService: ChatService,
		private readonly userService: UserService,
  ) {
		this.getUser();
		this.doSubscription();
	}

	getUser(): void {
		this.userService.getLoggedUser().subscribe(backUser=>{this.user=backUser;})
	}

	doSubscription() {
		this.getInvitation().subscribe(
			_ => {
				if (_.payload.to == this.user?.intraId || _.payload.from == this.user?.intraId) 
				{
					this.sentScreen =
						   _.payload.from == this.user?.intraId
						&& !_.payload.isReply

					this.receiveScreen =
						   _.payload.to == this.user?.intraId
						&& !_.payload.isReply
						&& !_.payload.note

					this.declineScreen =
						   _.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& !_.payload.answer
						&& !_.payload.note

					this.acceptScreen =
						   _.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& _.payload.answer
						&& !_.payload.instantaneous
						&& !_.payload.note

					if (
						   _.payload.from == this.user?.intraId
						&& _.payload.isReply
						&& _.payload.answer
						&& _.payload.instantaneous
						&& !_.payload.note
					) return this.go(_.payload.route);

					this.notificationScreen =
						   _.payload.to == this.user?.intraId
						&& !!_.payload.note;

					this.inviteState.next({
						receiveScreen: this.receiveScreen,
						declineScreen: this.declineScreen,
						acceptScreen: this.acceptScreen,
						sentScreen: this.sentScreen,
						notificationScreen: this.notificationScreen,
						invitation: _.payload,
					});
				}
			},
		);
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
		if (invite.route && invite.answer)
			this.go(invite.route);
	}

	replyTrue(invite: Invitation|undefined) {
		if (!invite) return;
		invite.answer = true;
		this.sendReply(invite);
	}

	replyFalse(invite: Invitation|undefined) {
		if (!invite) return;
		invite.answer = false;
		this.sendReply(invite);
	}

	getInvitation() {
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
