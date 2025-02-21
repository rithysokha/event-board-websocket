import Joi from 'joi';

export const commentSchema = Joi.object({
  comment: Joi.string().min(1).max(30).required(),
  userDisplayName: Joi.string().required(),
  // userDisplayPhoto: Joi.string().required(),
  postId: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date())
});
