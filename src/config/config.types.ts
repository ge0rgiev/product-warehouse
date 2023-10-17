import { AppConfigSchema } from './configuration/app.config';
import { DatabaseConfigSchema } from './configuration/database.config';
import { BcryptConfigSchema } from './configuration/bcrypt.config';
import { JwtConfigSchema } from './configuration/jwt.config';
import { RestConfigSchema } from './configuration/rest.config';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export enum ConfigKey {
  App = 'app',
  Database = 'database',
  Bcrypt = 'bcrypt',
  Jwt = 'jwt',
  Rest = 'rest',
}

export type ValidationSchema =
  | AppConfigSchema
  | DatabaseConfigSchema
  | BcryptConfigSchema
  | JwtConfigSchema
  | RestConfigSchema;
