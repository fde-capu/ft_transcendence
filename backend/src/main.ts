import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: environment.FRONTEND_ORIGIN, credentials: true });
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
