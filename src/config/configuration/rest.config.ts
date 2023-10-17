import { registerAs } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { ConfigKey } from '../config.types';

export class RestConfigSchema {
  @IsNotEmpty()
  REST_API_BASE_URL: string;
}

export const RestConfig = registerAs(ConfigKey.Rest, () => ({
  baseUrl: process.env.REST_API_BASE_URL,
}));
