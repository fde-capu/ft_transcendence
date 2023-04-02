import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PingController } from './ping/ping.controller';
import { Users } from './user/entity/user.entity';
import { MatchHistory } from './game/entity/match-history.entity';
import { QRSecret } from './auth/qrsecret-entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TokenParserMiddleware } from './auth/middleware/token-parser.middleware';
import { FortyTwoModule } from './forty-two/forty-two.module';
import { InvitationGateway } from './invite/invite.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
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
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res, path, stat) => {
          res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        },
      },
    }),
  ],
  controllers: [PingController, ChatController],
  providers: [InvitationGateway, ChatGateway, ChatService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenParserMiddleware).forRoutes('*');
  }
}
