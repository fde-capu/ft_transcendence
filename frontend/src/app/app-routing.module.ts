import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { LogOutComponent } from './log-out/log-out.component';

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
    path: 'chat/:roomId',
    canActivate: [AuthGuard],
    component: ChatBoxComponent,
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
    path: 'logout',
    component: LogOutComponent,
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
    path: 'invite',
    loadChildren: () => import('./invitation.module').then(m => m.InviteModule),
  },
  {
    path: '**',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
  },
];

//   Maybe these preLoading and onSameUrl are not useful anymore,
// v but I can't be sure!
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
