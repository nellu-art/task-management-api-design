import * as Joi from 'joi';

export const appConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'prod')
    .default('development'),
  PORT: Joi.string().pattern(/^\d+$/).default('3000'),
});
