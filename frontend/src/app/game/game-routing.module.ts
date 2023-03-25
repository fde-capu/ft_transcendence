import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LobbyComponent,
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}

