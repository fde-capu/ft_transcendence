import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomGateway } from './gateway/room.gateway';
import { RoomsGateway } from './gateway/rooms.gateway';
import { RoomsService } from './service/rooms.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [RoomsService, RoomsGateway, RoomGateway],
})
export class GameModule {}
