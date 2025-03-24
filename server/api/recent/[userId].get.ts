import { connectToDatabase } from "~/utils/mongodb";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("recent");
    const {userId} = getRouterParams(event)
  
      const records = await collection
      .find({userId: userId})
      .sort({ lastOpen: -1 })
      .toArray();

      return records;
  
    } catch (error) {
      console.error("Error fetching recent records:", error);
      throw createError({
        statusCode: 500,
        message: "Internal server error"
      });
    }
})
