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
    origin: 'http://localhost:3000', // Ajuste para a URL do seu frontend
    credentials: true, // Permite envio de cookies e auth headers
  });
  await app.listen(3001);
}
bootstrap();
