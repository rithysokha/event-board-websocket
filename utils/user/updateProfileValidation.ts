import Joi from "joi";

export const updateProfileSchema = Joi.object({
  image: Joi.string().required()
})