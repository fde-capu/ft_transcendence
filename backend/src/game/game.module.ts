import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './game/game.gateway';
import { RoomGateway } from './game/room.gateway';
import { LobbyGateway } from './game/lobby.gateway';

@Module({
  imports: [AuthModule],
  providers: [GameGateway, RoomGateway, LobbyGateway],
})
export class GameModule {}
