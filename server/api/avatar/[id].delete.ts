import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const {id} = getRouterParams(event)
    const db = await connectToDatabase();
    const collection = db.collection("avatar");
    const result = await collection.findOneAndDelete({ _id: new ObjectId(id) })
    
    if (!result) {
      setResponseStatus(event, 404)
      return {
        statusCode: 404,
        message: 'Avatar not found'
      }
    }
    return {
      statusCode: 200,
      message: 'Avatar deleted successfully'
    }
  } catch (error) {
    console.log(error);
  }
});
