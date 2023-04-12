import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './controller/match.controller';
import { MatchHistory, TeamMatchHistory } from './entity/match-history.entity';
import { RoomGateway } from './gateway/room.gateway';
import { RoomsGateway } from './gateway/rooms.gateway';
import { MatchHistoryService } from './service/match-history.service';
import { RoomsService } from './service/rooms.service';
import { QueueGateway } from './gateway/queue.gateway';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([MatchHistory, TeamMatchHistory]),
  ],
  controllers: [MatchController],
  providers: [RoomsService, RoomsGateway, QueueGateway, RoomGateway, MatchHistoryService],
})
export class GameModule {}
