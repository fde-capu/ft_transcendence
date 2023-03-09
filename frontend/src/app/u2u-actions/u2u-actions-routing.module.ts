import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { U2uActionsComponent } from './u2u-actions.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: U2uActionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class U2uActionsRoutingModule {}

