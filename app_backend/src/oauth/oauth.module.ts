import { Module } from '@nestjs/common';
import { Api42Controller } from './api42/api42.controller';

@Module({
  controllers: [Api42Controller],
})
export class OauthModule {}
