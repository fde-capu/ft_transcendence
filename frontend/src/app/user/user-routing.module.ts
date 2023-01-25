import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { UserResolver } from './resolver/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      currentUser: UserResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
