import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import { AvatarComponent } from './avatar/avatar.component';

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
    path: 'profile/:intraId',
    component: ProfileComponent,
  },{
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'online',
    component: OnlineUsersComponent,
  },
  {
    path: 'avatar',
    component: AvatarComponent,
  },
  {
    path: 'chat-text',
    component: ChatTextComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
