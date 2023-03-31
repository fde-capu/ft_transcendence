import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './components/game/game.component';
import { GameSocket } from './socket/rooms.socket';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomComponent } from './components/room/room.component';
import { MenuBarModule } from '../menu-bar/menu-bar.module';
import { InviteModule } from '../invitation.module';
import { ModalComponent } from './components/modal/modal.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    GameComponent,
    RoomsComponent,
    RoomComponent,
    ModalComponent,
    HistoryComponent,
  ],
  imports: [CommonModule, GameRoutingModule, MenuBarModule, InviteModule],
  providers: [GameSocket],
})
export class GameModule {}
