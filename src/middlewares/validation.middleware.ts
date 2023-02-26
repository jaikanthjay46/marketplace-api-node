import Joi from '@hapi/joi';
import { celebrate } from 'celebrate';
import { UserRoleEnum } from '../types/enums';

// Declare here custom validation schemas
const schemas = {
  id: Joi.number().integer().positive(),
  username: Joi.string().min(6).max(50).trim(),
  role: Joi.string().valid(...Object.values(UserRoleEnum)),
  password: Joi.string().min(8).max(64),
  uuid: Joi.string().guid(),
};

export { celebrate, Joi, schemas };
