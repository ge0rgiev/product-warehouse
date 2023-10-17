import { registerAs } from '@nestjs/config';
import { IsBooleanString, IsNotEmpty } from 'class-validator';
import { ConfigKey } from '../config.types';

export class JwtConfigSchema {
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  JWT_EXPIRATION: string;

  @IsBooleanString()
  JWT_IGNORE_EXPIRATION: string;
}

export const JwtConfig = registerAs(ConfigKey.Jwt, () => ({
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION,
  ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'true' ? true : false,
}));
