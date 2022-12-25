import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['debug', 'error', 'log'],
      /**
       * Turn of the bodyParser to handle the raw-body from stripe-webhook
       */
      bodyParser: true,
      bufferLogs: true,
      cors: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    const configService: ConfigService = app.get(ConfigService);

    const port = configService.get('APP_PORT');

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(port);
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
