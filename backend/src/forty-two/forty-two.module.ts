import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FortyTwoService } from './service/forty-two.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [FortyTwoService, ConfigService],
  exports: [FortyTwoService],
})
export class FortyTwoModule {}
