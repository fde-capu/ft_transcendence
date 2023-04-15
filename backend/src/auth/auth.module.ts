import { Module, forwardRef } from '@nestjs/common';
import { FortyTwoModule } from 'src/forty-two/forty-two.module';
import { AuthController } from './controller/auth.controller';
import { TokenService } from './service/token.service';
import { OtpService } from './service/otp.service';
import { AuthService } from './service/auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/service/user.service';
import { ConfigService } from '@nestjs/config';
import { QRSecret } from './entity/qrsecret-entity';

@Module({
  providers: [
    TokenService,
    OtpService,
    AuthService,
    UserService,
    ConfigService,
    AuthController,
  ],
  imports: [
    FortyTwoModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Users, QRSecret]),
  ],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
