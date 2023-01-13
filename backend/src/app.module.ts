import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RegisterController } from './user/controller/registred.controller';
import { UserService } from './user/service/user.service';
import { ConfigModule } from '@nestjs/config';
import { PingController } from './ping/ping.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [RegisterController, PingController],
  providers: [UserService],
})
export class AppModule {}
