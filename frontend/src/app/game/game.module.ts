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
import { LadderComponent } from './components/ladder/ladder.component';
import { GameNotificationComponent } from './components/game-notification/game-notification.component';
import { NotificationModule } from '../notification/notification.module';
import { GameTestComponent } from './components/game-test/game-test.component';

@NgModule({
  declarations: [
    GameComponent,
    RoomsComponent,
    RoomComponent,
    ModalComponent,
    HistoryComponent,
    LadderComponent,
    GameNotificationComponent,
    GameTestComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MenuBarModule,
    InviteModule,
    NotificationModule,
  ],
  providers: [GameSocket],
  exports: [HistoryComponent, LadderComponent, GameNotificationComponent],
})
export class GameModule {}
