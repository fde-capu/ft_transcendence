import { Module } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { UserController } from './controller/user.controller';

@Module({
  imports: [FortyTwoModule],
  controllers: [UserController],
})
export class UserModule {}
