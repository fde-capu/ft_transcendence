import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PingController } from './ping/ping.controller';
import { Users } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { RegisterController } from './user/controller/registred.controller';
import { UserService } from './user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TokenParserMiddleware } from './auth/middleware/token-parser.middleware';
import { FortyTwoModule } from './forty-two/forty-two.module';

@Module({
  imports: [UserModule, HttpModule, ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Users],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FortyTwoModule,
    GameModule,
  ],
  controllers: [PingController],
  providers: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenParserMiddleware).forRoutes('*');
  }
}
