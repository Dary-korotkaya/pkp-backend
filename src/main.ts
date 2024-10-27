import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000', // Укажите домен вашего фронтенда
    credentials: true, // Разрешить отправку куков
    allowedHeaders: 'content-type',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    maxAge: 1800,
  });
  await app.listen(3001);
}
bootstrap();
