import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';
import { editPostSchema } from "~/utils/post/editPostSchema";

export default defineEventHandler(async (event) => {
  try {
    const {id} = getRouterParams(event)
    
    if (!id || typeof id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Avatar ID is required and must be a string'
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection("avatar");

    const body = await readBody(event);
    const { error, value } = editPostSchema.validate(body);
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
        message: 'avatar not found'
      });
    }

    return {
      message: 'avatar updated successfully',
      data: value
    };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});