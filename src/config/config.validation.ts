import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationSchemas } from './configuration';
import { ValidationSchema } from './config.types';

const schemas: Array<new () => ValidationSchema> = validationSchemas;

export function validate(configuration: Record<string, unknown>) {
  let index = 0;

  for (const schema of schemas) {
    const finalConfig = plainToClass(schema, configuration, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(finalConfig, { skipMissingProperties: false });

    for (const err of errors) {
      Object.values(err.constraints).forEach((str) => {
        ++index;
        console.log(index, str);
      });
      console.log('\n ***** \n');
    }

    if (errors.length) {
      throw new Error('Configuration validation errors');
    }
  }

  return configuration;
}
