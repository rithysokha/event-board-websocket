import Joi from 'joi';

export const boardSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  description: Joi.string().max(100),
  belongsTo: Joi.string().max(200),
  background: Joi.string(),
  format: Joi.string(),
  colorScheme: Joi.string(),
  font: Joi.string(),
  sort: Joi.string(),
  comment: Joi.boolean(),
  reaction: Joi.boolean(),
  moderation: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(() => new Date())
});
