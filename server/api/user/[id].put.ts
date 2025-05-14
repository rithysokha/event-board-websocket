import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';
import { editUserShcema } from "~/utils/user/editUserValidation";

export default defineEventHandler(async (event) => {
  try {
    const {id} = getRouterParams(event)
    
    if (!id || typeof id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'user id must be a string'
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection("user");
    const body = await readBody(event);
    const { error, value } = editUserShcema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...value} }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return {
      message: 'User updated successfully',
      data: value
    };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});