import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: FttAuthenticatorComponent,
  },
  {
    path: 'login',
    component: FttAuthenticatorComponent,
  },
  {
    path: 'game',
    component: GameComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
	// TODO set profile/intraId to show any user.
  },
  {
    path: 'online',
    component: OnlineUsersComponent,
  },
  {
    path: 'user',
    component: UserProfileComponent,
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
