import * as joi from 'joi';

export const JoiValidationSchemaEnvironmments = joi.object({
  MONGODB: joi.required(),
  // inyecta "3005" no el numero
  PORT: joi.number().default(3005),
  // inyecta "6" no el numero
  DEFAULT_LIMIT: joi.number().default(6),
});
