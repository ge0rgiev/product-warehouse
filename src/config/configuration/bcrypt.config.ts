import { registerAs } from '@nestjs/config';
import { IsNumber } from 'class-validator';
import { ConfigKey } from '../config.types';

export class BcryptConfigSchema {
  @IsNumber()
  BCRYPT_ROUNDS: number;
}

export const BcryptConfig = registerAs(ConfigKey.Bcrypt, () => ({
  rounds: parseInt(process.env.BCRYPT_ROUNDS, 10),
}));
