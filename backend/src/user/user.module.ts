import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { Users } from './entity/user.entity';
import { UserService } from './service/user.service';
import { OnlineGateway } from './gateway/online.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UserController],
  providers: [UserService, OnlineGateway],
  exports: [UserService],
})
export class UserModule {}
