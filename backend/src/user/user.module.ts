import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './controller/registred.controller';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';


@Module({
  imports: [HttpModule, ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User])],
  controllers: [RegisterController],
  providers: [UserService],
})
export class UserModule { }
