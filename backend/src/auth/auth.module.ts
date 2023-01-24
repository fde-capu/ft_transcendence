import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FortyTwoService } from './forty-two/forty-two.service';
import { AuthController } from './auth/auth.controller';
import { TokenService } from './token/token.service';

@Module({
  imports: [HttpModule],
  providers: [FortyTwoService, TokenService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
