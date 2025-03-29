import Joi from "joi"
export const recentSchema = Joi.object({
  userId: Joi.string().required(),
  boardId: Joi.string().required(),
  name:Joi.string(),
  background:Joi.string(),
  lastOpen: Joi.date().timestamp('javascript').default(() => new Date())
})