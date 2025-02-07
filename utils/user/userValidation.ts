import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string().required(),
  role: Joi.string().max(5).default('user'),
  picture: Joi.string().allow(''),
  name: Joi.string(),
  blockedAt:Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})