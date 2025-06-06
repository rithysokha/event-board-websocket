import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';
import { updateProfileSchema } from "~/utils/user/updateProfileValidation";

export default defineEventHandler(async (event) => {
  try {
    const {email} = getRouterParams(event)
    
    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'user email must be a string'
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection("user");
    const body = await readBody(event);
    const { error, value } = updateProfileSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
    const result = await collection.updateOne(
      { email: email },
      { $set: { ...value} }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return {
      message: 'Profile updated successfully',
      data: value
    };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});