import { Component, OnInit } from '@angular/core';
import { InvitationService } from '../invitation.service';
import { InviteState } from '../invitation';
import { HelperFunctionsService } from '../helper-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css'],
})
export class InvitationScreenComponent implements OnInit {
  static state: InviteState[] = [];
  static connected = false;
  myState: InviteState | undefined = undefined;
  clickGo?: boolean;

  constructor(
    private readonly invitationService: InvitationService,
    private readonly fun: HelperFunctionsService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.myState = InvitationScreenComponent.state[0];
    if (InvitationScreenComponent.connected) return;
    InvitationScreenComponent.connected = true;
    InvitationService.inviteState.subscribe(_ => {
      if (_) {
        if (
          _.receiveScreen ||
          _.friendScreen ||
          _.declineScreen ||
          _.acceptScreen ||
          _.sentScreen ||
          _.notificationScreen
        )
          InvitationScreenComponent.state.push({
            receiveScreen: _.receiveScreen,
            friendScreen: _.friendScreen,
            declineScreen: _.declineScreen,
            acceptScreen: _.acceptScreen,
            sentScreen: _.sentScreen,
            notificationScreen: _.notificationScreen,
            invitation: _.invitation,
          });
        this.router.navigate([this.router.url]);
      }
    });
  }

  flip(): InviteState | undefined {
    const old = InvitationScreenComponent.state.shift();
    this.myState = InvitationScreenComponent.state[0];
    return old;
  }

  accept() {
    const old = this.flip();
    if (old && old.invitation) this.invitationService.replyTrue(old.invitation);
  }

  decline() {
    const old = this.flip();
    if (old && old.invitation)
      this.invitationService.replyFalse(old.invitation);
  }

  alreadyInRoute(): boolean {
    const route = this.myState?.invitation?.route;
    return route == this.router.url;
  }

  finalOk() {
    const old = this.flip();
    if (!old) return;
    if (
      old.acceptScreen &&
      old.invitation &&
      old.invitation.type == 'Friendship Request'
    )
      this.invitationService.mutualFriends(
        old.invitation.from,
        old.invitation.to
      );
    const go = (old.acceptScreen || old.notificationScreen) && this.clickGo;
    const route = go ? old.invitation?.route : null;
    if (go && route && !this.alreadyInRoute()) return this.invitationService.go(route);
    this.router.navigate([this.router.url]);
  }
}
