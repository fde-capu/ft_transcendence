import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AvatarComponent } from './avatar.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AvatarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvatarRoutingModule {}

