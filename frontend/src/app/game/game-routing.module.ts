import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomComponent } from './components/room/room.component';
import { HistoryComponent } from './components/history/history.component';
import { GameTestComponent } from './components/game-test/game-test.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: RoomsComponent,
  },
  {
    path: 'test',
    canActivate: [AuthGuard],
    component: GameTestComponent,
  },
  {
    path: 'history',
    canActivate: [AuthGuard],
    component: HistoryComponent,
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
