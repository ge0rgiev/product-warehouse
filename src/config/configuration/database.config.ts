import { registerAs } from '@nestjs/config';
import { ConfigKey } from '../config.types';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class DatabaseConfigSchema {
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  @Max(65536)
  @Min(1)
  DATABASE_PORT: number;

  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsBooleanString()
  DATABASE_SYNC: string;
}

export const DatabaseConfig = registerAs(ConfigKey.Database, () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  sync: process.env.DATABASE_SYNC === 'true' ? true : false,
}));
