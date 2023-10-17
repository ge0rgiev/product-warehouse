import { registerAs } from '@nestjs/config';
import { Environment, ConfigKey } from '../config.types';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AppConfigSchema {
  @IsEnum(Environment)
  APP_ENV: Environment;

  @IsNotEmpty()
  APP_HOST: string;

  @IsNumber()
  @Max(65536)
  @Min(1)
  APP_PORT: number;
}

export const AppConfig = registerAs(ConfigKey.App, () => ({
  env: process.env.APP_ENV,
  host: process.env.APP_HOST,
  port: parseInt(process.env.APP_PORT, 10),
}));
