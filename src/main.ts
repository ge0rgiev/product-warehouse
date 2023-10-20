import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
// import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  // app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const [port, host] = [
    configService.get('app.port'),
    configService.get('app.host'),
  ];

  await app.listen(port, host, () =>
    logger.log(`Listening on http://${host}:${port}`),
  );
}
bootstrap();
