import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: environment.FRONTEND_ORIGIN, credentials: true });
  app.use(
    // @ts-ignore
    helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000); // TODO: change to BACKEND_PORT or alike. Verify all references to 3000, 4200 or 5432 if are not hardcoded.
}
bootstrap();
