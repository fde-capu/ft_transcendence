import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FortyTwoService } from './forty-two/forty-two.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [HttpModule],
  providers: [FortyTwoService],
  controllers: [AuthController],
})
export class AuthModule {}
