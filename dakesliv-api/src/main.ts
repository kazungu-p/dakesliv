// Must be the very first import — every other module (auth, bookings,
// payments) reads process.env.JWT_SECRET the instant it's imported, which
// happens before NestFactory.create() runs and before ConfigModule would
// otherwise load .env. Without this line first, JWT_SECRET is undefined
// everywhere it's used, and every signed-in request fails with a silent
// "session expired" — found by actually testing the login flow, not by
// inspection.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // tighten to the web/app origins before going live
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
