import { AppConfig, AppConfigSchema } from './app.config';
import { DatabaseConfig, DatabaseConfigSchema } from './database.config';
import { BcryptConfig, BcryptConfigSchema } from './bcrypt.config';
import { JwtConfig, JwtConfigSchema } from './jwt.config';
import { RestConfig, RestConfigSchema } from './rest.config';

export const configurations = [
  AppConfig,
  DatabaseConfig,
  BcryptConfig,
  JwtConfig,
  RestConfig,
];

export const validationSchemas = [
  AppConfigSchema,
  DatabaseConfigSchema,
  BcryptConfigSchema,
  JwtConfigSchema,
  RestConfigSchema,
];
