import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

