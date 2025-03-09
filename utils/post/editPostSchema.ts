import Joi from "joi";

export const editPostSchema = Joi.object({
  likes: Joi.number(),
  commentCount:Joi.number()
})