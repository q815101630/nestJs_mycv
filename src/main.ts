import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['super'], //for encryption purpose
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // means: only allow those I defined in DTO to be validate
    }),
  );
  await app.listen(3000);
}
bootstrap();
