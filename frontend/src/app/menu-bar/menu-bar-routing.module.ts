import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { MenuBarComponent } from './menu-bar.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MenuBarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuBarRoutingModule {}
