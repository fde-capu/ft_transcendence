import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';
import { OtpService } from './service/otp.service';
import { AuthService } from './service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entity/user.entity';

@Module({
  imports: [FortyTwoModule, UserModule,
    TypeOrmModule.forFeature([Users])
  ],
  providers: [TokenService, OtpService, AuthService, UserService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
