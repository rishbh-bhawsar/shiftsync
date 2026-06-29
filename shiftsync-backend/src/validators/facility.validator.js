import Joi from 'joi';

export const createFacilitySchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  address: Joi.string().required(),
  locationLat: Joi.number().required(),
  locationLng: Joi.number().required(),
  phone: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  type: Joi.string().valid('hospital', 'clinic', 'nursing_home').required(),
  managerId: Joi.string().uuid().required(),
});

export const updateFacilitySchema = Joi.object({
  name: Joi.string().min(2).max(200),
  address: Joi.string(),
  locationLat: Joi.number(),
  locationLng: Joi.number(),
  phone: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  type: Joi.string().valid('hospital', 'clinic', 'nursing_home'),
}).min(1);
