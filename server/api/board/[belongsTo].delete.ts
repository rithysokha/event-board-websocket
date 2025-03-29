import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const {belongsTo: id} = getRouterParams(event) //this belongs to is id
    const db = await connectToDatabase();
    const collectionBoard = db.collection("board");
    const collectionRecent = db.collection("recent")
    const result = await collectionBoard.updateOne({ _id: new ObjectId(id) }
  ,{
    $set:{
      deletedAt: new Date()
    }
  }
  );
    if (result.deletedCount < 1) {
      setResponseStatus(event, 404)
      return {
        statusCode: 404,
        message: 'Post not found'
      }
    }
    await collectionRecent.deleteMany(
      {boardId:id}
    )
    return {
      statusCode: 200,
      message: 'deleted'
    }
  } catch (error) {
    console.log(error);
  }
});
