import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './gateway/game.gateway';
import { RoomGateway } from './gateway/room.gateway';
import { RoomService } from './service/room.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [GameGateway, RoomGateway, RoomService],
})
export class GameModule {}
