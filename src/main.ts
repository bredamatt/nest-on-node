import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // unwanted properties are stripped out
      forbidNonWhitelisted: true, // throws error with unwanted properties
      transformOptions: {
        enableImplicitConversion: true,
      }
  }));
  await app.listen(3000);
}
bootstrap();
