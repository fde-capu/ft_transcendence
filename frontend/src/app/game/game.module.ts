import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './components/game/game.component';
import { GameSocket } from './socket/game.socket';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';

import { MenuBarModule } from '../menu-bar/menu-bar.module';
@NgModule({
  declarations: [
	GameComponent,
	LobbyComponent,
	RoomComponent,
  ],
  imports: [
	CommonModule,
	GameRoutingModule,
	MenuBarModule,
  ],
  providers: [GameSocket],
})
export class GameModule {}

