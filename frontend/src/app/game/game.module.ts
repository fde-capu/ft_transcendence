import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './components/game/game.component';
import { GameSocket } from './socket/game.socket';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule],
  providers: [GameSocket],
})
export class GameModule {}
