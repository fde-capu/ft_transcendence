import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: environment.FRONTEND_ORIGIN, credentials: true });
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }),
  );
  app.use(cookieParser());
  await app.listen(3000); // TODO: change to BACKEND_PORT or alike. Verify all references to 3000, 4200 or 5432 if are not hardcoded.
}
bootstrap();
