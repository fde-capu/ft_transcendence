import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationGateway } from './gateway/notification.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
