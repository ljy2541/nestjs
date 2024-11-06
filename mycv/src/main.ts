import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret:
        '840672b4d03a5d432b57164bb772922d1690acc09c3c99af184e95f532bfb5e6',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
