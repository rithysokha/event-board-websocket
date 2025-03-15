import Joi from 'joi';

export const boardSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  url: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date())
});
