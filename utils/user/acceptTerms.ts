import Joi from "joi";

export const acceptTermsSchema = Joi.object({
    email: Joi.string().required()
})