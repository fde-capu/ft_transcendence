import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { GameComponent } from './game/components/game/game.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile/:intraId',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'online',
    canActivate: [AuthGuard],
    component: OnlineUsersComponent,
  },
  {
    path: 'create-match',
    canActivate: [AuthGuard],
    component: CreateMatchComponent,
  },
  {
    path: 'avatar',
    canActivate: [AuthGuard],
    component: AvatarComponent,
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: ChatBoxComponent,
  },
  {
    path: 'rooms',
    canActivate: [AuthGuard],
    component: ChatRoomListComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
  },
  {
    path: '**',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
