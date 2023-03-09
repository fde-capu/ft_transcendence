import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './controller/registred.controller';
import { Users } from './entity/user.entity';
import { UserService } from './service/user.service';
import { GameHistory } from '../game/game-record';
import { GameService } from '../game/game.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, GameHistory]),
  ],
  controllers: [RegisterController],
  providers: [UserService, GameService],
})
export class UserModule {}
