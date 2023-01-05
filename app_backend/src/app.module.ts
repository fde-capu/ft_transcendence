import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RegisterController } from './user/controller/registred.controller';
import { UserService } from './user/service/user.service';

@Module({
  imports: [HttpModule],
  controllers: [RegisterController],
  providers: [UserService],
})
export class AppModule {}
