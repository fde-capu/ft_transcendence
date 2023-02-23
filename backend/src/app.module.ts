import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokenParserMiddleware } from './auth/middleware/token-parser.middleware';
import { FortyTwoModule } from './forty-two/forty-two.module';
import { PingController } from './ping/ping.controller';
import { Users } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { RegisterController } from './user/controller/registred.controller';
import { UserService } from './user/service/user.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
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
