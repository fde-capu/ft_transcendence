import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CreateMatchComponent } from './create-match/create-match.component';

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
    path: 'game',
    canActivate: [AuthGuard],
    component: GameComponent,
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
	component: CreateMatchComponent,
  },
  {
    path: 'avatar',
    canActivate: [AuthGuard],
    component: AvatarComponent,
  },
  {
    path: 'chat-text',
    component: ChatTextComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
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
