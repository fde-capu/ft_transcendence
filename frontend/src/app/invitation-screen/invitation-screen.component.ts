import { Component, OnInit } from '@angular/core';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation';
import { UserService } from '../user.service';
import { User } from '../user';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css'],
})
export class InvitationScreenComponent implements OnInit {
  invite: Invitation[] = [];

  lastInvite?: Invitation;

  user?: User;

  receiveScreen?: boolean;

  declineScreen?: boolean;

  acceptScreen?: boolean;

  sentScreen?: boolean;

  clickGo?: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly fun: HelperFunctionsService
  ) {}

  ngOnInit() {
    this.getUser();
    this.socketSubscription();
  }

  getUser(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
    });
  }

  socketSubscription() {
    this.invitationService.getInvitation().subscribe(thing => {
      if (
        thing.payload.to == this.user?.intraId ||
        thing.payload.from == this.user?.intraId
      ) {
        this.sentScreen =
          thing.payload.from == this.user?.intraId && !thing.payload.isReply;
        this.receiveScreen =
          thing.payload.to == this.user?.intraId && !thing.payload.isReply;
        this.declineScreen =
          thing.payload.from == this.user?.intraId &&
          thing.payload.isReply &&
          !thing.payload.answer;
        this.acceptScreen =
          thing.payload.from == this.user?.intraId &&
          thing.payload.isReply &&
          thing.payload.answer &&
          !thing.payload.instantaneous;
        if (
          thing.payload.from == this.user?.intraId &&
          thing.payload.isReply &&
          thing.payload.answer &&
          thing.payload.instantaneous
        )
          return this.invitationService.go(thing.payload.route);
        this.invite.push(thing.payload);
      }
    });
  }

  accept() {
    this.finish();
    if (!this.lastInvite) return;
    this.invitationService.replyTrue(this.lastInvite);
  }

  decline() {
    this.finish();
    if (!this.lastInvite) return;
    this.invitationService.replyFalse(this.lastInvite);
    this.receiveScreen = false;
  }

  finish() {
    this.lastInvite = this.invite.shift();
  }

  finalOk() {
    this.finish();
    if (!this.lastInvite) return;
    const go = this.acceptScreen && this.clickGo;
    this.clickGo = false;
    this.receiveScreen = false;
    this.declineScreen = false;
    this.acceptScreen = false;
    this.sentScreen = false;
    if (go) this.invitationService.go(this.lastInvite.route);
  }

  mockInvite() {
    this.invitationService.invite({
      from: 'fde-capu',
      to: 'mockUser',
      type: 'Go to the chatroom lobby (/rooms).',
      route: '/rooms',
      isReply: false,
    });
  }

  mockDecline() {
    this.invitationService.invite({
      from: 'fde-capu',
      to: 'mockUser',
      type: 'Go to the chatroom lobby (/rooms).',
      route: '/rooms',
      isReply: true,
      answer: false,
    });
  }

  mockAccept() {
    this.invitationService.invite({
      from: 'fde-capu',
      to: 'mockUser',
      type: 'Go to the chatroom lobby (/rooms).',
      route: '/rooms',
      isReply: true,
      answer: true,
    });
  }

  mockAcceptInstantaneous() {
    this.invitationService.invite({
      from: 'fde-capu',
      to: 'mockUser',
      type: 'Go to the chatroom lobby (/rooms).',
      route: '/rooms',
      isReply: true,
      answer: true,
      instantaneous: true,
    });
  }

  mockReceive() {
    this.invitationService.invite({
      from: 'mockUser',
      to: 'fde-capu',
      type: 'Go to the chatroom lobby (/rooms).',
      route: '/rooms',
      isReply: false,
    });
  }
}
