import Joi from "joi";

export const editPostSchema = Joi.object({
  likes: Joi.number().required()
})