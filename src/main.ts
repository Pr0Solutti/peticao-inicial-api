import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://peticao-inicial-form-app-production.up.railway.app',
      'https://peticao-inicial-form-app-staging.up.railway.app',
      'http://localhost:3000',
    ],
    credentials: true, // Permite o envio de cookies
  });
  await app.listen(3001);
}
bootstrap();
