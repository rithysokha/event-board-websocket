import Joi from 'joi';

export const boardSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  image: Joi.string().required()
});
