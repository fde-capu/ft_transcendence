import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';

@Module({
  imports: [FortyTwoModule],
  providers: [TokenService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
