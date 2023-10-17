import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerMiddleware } from './logger.middleware';
import { Request } from 'express';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('app.env') != 'production'
          ? {
              pinoHttp: {
                base: { pid: null },
                customProps: (req: Request) => ({ reqId: req['reqId'] }),
                serializers: {
                  req: () => undefined,
                  res: () => undefined,
                },
                transport: {
                  target: 'pino-pretty',
                  options: {
                    levelFirst: true,
                    messageKey: 'message',
                    translateTime: 'dd/mm/yyyy HH:MM:ss',
                  },
                },
                messageKey: 'message',
              },
            }
          : {};
      },
    }),
  ],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
