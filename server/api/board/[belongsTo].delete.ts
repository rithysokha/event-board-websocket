import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const {belongsTo} = getRouterParams(event) //this belongs to is id
    const db = await connectToDatabase();
    const collection = db.collection("board");
    const result = await collection.deleteOne({ _id: new ObjectId(belongsTo) });
    if (result.deletedCount < 1) {
      setResponseStatus(event, 404)
      return {
        statusCode: 404,
        message: 'Post not found'
      }
    }
    return {
      statusCode: 200,
      message: 'deleted'
    }
  } catch (error) {
    console.log(error);
  }
});
