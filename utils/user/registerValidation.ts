import Joi from "joi";

export const registerSchema = Joi.object({
  isLogin: Joi.boolean(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({ 'any.only': 'Passwords do not match' }),
  role: Joi.string().default('user'),
  image: Joi.string().default(''),
  blockedAt: Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})