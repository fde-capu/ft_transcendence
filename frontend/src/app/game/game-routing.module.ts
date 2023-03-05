import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  {
    path: 'room',
    component: LobbyComponent,
  },
  {
    path: 'room/:id',
    component: RoomComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'room',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
