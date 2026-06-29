import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().allow('', null),
  role: Joi.string().valid('admin', 'facility', 'worker').required(),
  specializations: Joi.array().items(Joi.string()).allow(null).when('role', {
    is: 'worker',
    then: Joi.required(),
  }),
  licenseNumber: Joi.string().allow('', null).when('role', {
    is: 'worker',
    then: Joi.required(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
