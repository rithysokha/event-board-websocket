import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const {id} = getRouterParams(event)
    const db = await connectToDatabase();
    const collectionBoard = db.collection("board");
    const postCollection = db.collection("post")
    const result = await collectionBoard.findOneAndDelete({ _id: new ObjectId(id) });
    if (result.deletedCount < 1) {
      setResponseStatus(event, 404)
      return {
        statusCode: 404,
        message: 'Post not found'
      }
    }
    await postCollection.deleteMany({ boardId: id })
  
    return {
      statusCode: 200,
      message: 'deleted'
    }
  } catch (error) {
    console.log(error);
  }
});
