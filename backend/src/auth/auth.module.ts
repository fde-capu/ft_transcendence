import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';
import { OtpService } from './service/otp.service';

@Module({
  imports: [FortyTwoModule],
  providers: [TokenService, OtpService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
