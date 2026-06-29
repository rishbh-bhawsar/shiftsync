import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().allow('', null),
  specializations: Joi.array().items(Joi.string()),
  licenseNumber: Joi.string(),
}).min(1);
