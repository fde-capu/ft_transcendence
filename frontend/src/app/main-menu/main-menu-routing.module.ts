import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { MainMenuComponent } from './main-menu.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainMenuRoutingModule {}
