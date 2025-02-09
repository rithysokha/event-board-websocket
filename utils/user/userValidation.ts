import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().required(),
  role: Joi.string().max(5).default('user'),
  image: Joi.string(),
  name: Joi.string(),
  blockedAt:Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})