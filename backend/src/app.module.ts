import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PingController } from './ping/ping.controller';
import { Users } from './user/entity/user.entity';
import { MatchHistory } from './game/entity/match-history.entity';
import { QRSecret } from './auth/entity/qrsecret-entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatService } from './chat/service/chat.service';
import { ChatController } from './chat/controller/chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TokenParserMiddleware } from './auth/middleware/token-parser.middleware';
import { FortyTwoModule } from './forty-two/forty-two.module';
import { InvitationGateway } from './invite/invite.gateway';
import { ChatGateway } from './chat/gateway/chat.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QueueGateway } from './game/gateway/queue.gateway';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    UserModule,
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Users, MatchHistory, QRSecret],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FortyTwoModule,
    GameModule,
    ServeStaticModule.forRoot({
      rootPath: '/var/tmp/uploads',
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    NotificationModule,
  ],
  controllers: [PingController, ChatController],
  providers: [InvitationGateway, ChatGateway, ChatService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenParserMiddleware).forRoutes('*');
  }
}
