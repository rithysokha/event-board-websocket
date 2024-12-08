import { connectToDatabase } from "~/utils/mongodb";
import { boardSchema } from "~/utils/board/boardPutValidation";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const { boardId } = getQuery(event);
    console.log(" id" , boardId)
    if (!boardId) {
      throw createError({
        statusCode: 400,
        message: 'Board ID is required'
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection("board");

    const body = await readBody(event);
    const { error, value } = boardSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $set: { ...value} }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Board not found'
      });
    }

    return {
      message: 'Board updated successfully',
      data: value
    };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});