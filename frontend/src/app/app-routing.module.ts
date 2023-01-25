import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: FttAuthenticatorComponent,
  },
  {
    path: 'game',
    component: GameComponent,
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
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
