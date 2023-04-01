import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';
import { OtpService } from './service/otp.service';
import { AuthService } from './service/auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [TokenService, OtpService, AuthService, ConfigService],
  imports: [FortyTwoModule, UserModule],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
