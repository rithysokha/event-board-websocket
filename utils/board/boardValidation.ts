import Joi from 'joi';

export const boardSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(100).default(null),
  belongsTo: Joi.string().max(200),
  background: Joi.string().default('white'),
  format: Joi.string().default('wall'),
  colorScheme: Joi.string().default('Light'),
  font: Joi.string().default('manrope'),
  sort: Joi.string().default('desc'),
  comment: Joi.boolean().default(true),
  reaction: Joi.boolean().default(true),
  moderation: Joi.boolean().default(false),
  post:Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
});
