import Joi from "joi"
export const presetSchema = Joi.object({
  name:Joi.string().required(),
  like:Joi.boolean().required(),
  comment:Joi.boolean(),
  format:Joi.string(),
  image:Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
  updatedAt: Joi.date().timestamp('javascript').optional()
})