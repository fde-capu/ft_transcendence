import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationScreenComponent } from './invitation-screen/invitation-screen.component';

const routes: Routes = [{ path: '', component: InvitationScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteRoutingModule {}
