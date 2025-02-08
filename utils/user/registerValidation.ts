import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({ 'any.only': 'Passwords do not match' }),
  image: Joi.string(),
  blockedAt: Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})