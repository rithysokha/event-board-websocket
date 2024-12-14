import Joi from "joi";

export const postSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().max(30).allow(''),
  imgPublicId: Joi.string().allow(''),
  description: Joi.string().max(100).allow(''),
  likes: Joi.number().default(0),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})