import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configurations } from './configuration';
import { validate } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      validate,
    }),
  ],
})
export class ConfigModule {}
