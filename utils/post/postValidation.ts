import Joi from "joi";

export const postSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().min(1).max(30).required(),
  description: Joi.string().max(100),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})