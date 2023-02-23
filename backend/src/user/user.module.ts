import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './controller/registred.controller';
import { Users } from './entity/user.entity';
import { UserService } from './service/user.service';

//@Module({
//  imports: [
//	HttpModule,
//	ConfigModule.forRoot(),
//    TypeOrmModule.forFeature([Users])
//  ],
//  controllers: [RegisterController],
//  providers: [UserService],
//})
//export class UserModule { }

@Module({
  imports: [
	HttpModule,
	ConfigModule.forRoot()
  ],
  controllers: [RegisterController],
  providers: [UserService],
})
export class UserModule { }
