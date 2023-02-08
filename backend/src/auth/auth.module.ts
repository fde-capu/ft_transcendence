import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';
import { OtpService } from './service/otp.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [FortyTwoModule],
  providers: [TokenService, OtpService, AuthService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
