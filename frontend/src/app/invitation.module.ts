import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InvitationScreenComponent } from './invitation-screen/invitation-screen.component';
import { InviteSocket } from './invite.socket';

@NgModule({
  declarations: [InvitationScreenComponent],
  imports: [CommonModule, InviteRoutingModule],
  providers: [InviteSocket],
  exports: [InvitationScreenComponent],
})
export class InviteModule {}
