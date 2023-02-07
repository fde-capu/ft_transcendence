import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: FttAuthenticatorComponent,
  },
  {
    path: 'game',
    canActivate: [AuthGuard],
    component: GameComponent,
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
