import Joi from "joi";

export const postSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().max(30).allow(''),
  imgPublicId: Joi.string().allow(''),
  imgHeigh: Joi.number(),
  imgWidth: Joi.number(),
  description: Joi.string().max(100).allow(''),
  likes: Joi.number().default(0),
  postedBy: Joi.string().max(30),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),
})