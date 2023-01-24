import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FortyTwoService } from './service/forty-two.service';

@Module({
  imports: [HttpModule],
  providers: [FortyTwoService],
  exports: [FortyTwoService],
})
export class FortyTwoModule {}
