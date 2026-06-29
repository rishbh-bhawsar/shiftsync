import Joi from 'joi';

export const createShiftSchema = Joi.object({
  facilityId: Joi.string().uuid().required(),
  title: Joi.string().min(2).max(200).required(),
  specialization: Joi.string().required(),
  date: Joi.date().iso().required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  payRate: Joi.number().positive().required(),
  requiredWorkers: Joi.number().integer().min(1).default(1),
  description: Joi.string().allow('', null),
  requirements: Joi.array().items(Joi.string()),
});

export const updateShiftSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  specialization: Joi.string(),
  date: Joi.date().iso(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  payRate: Joi.number().positive(),
  requiredWorkers: Joi.number().integer().min(1),
  description: Joi.string().allow('', null),
  requirements: Joi.array().items(Joi.string()),
  status: Joi.string().valid('open', 'cancelled', 'completed'),
}).min(1);
