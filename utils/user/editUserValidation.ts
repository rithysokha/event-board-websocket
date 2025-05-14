import Joi from "joi";

export const editUserShcema = Joi.object({
    role: Joi.string().max(5),
    blockedAt:Joi.date().timestamp('javascript'),
})