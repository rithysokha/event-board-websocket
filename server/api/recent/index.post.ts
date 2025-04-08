import { connectToDatabase } from "~/utils/mongodb";
import { recentSchema } from "~/utils/recent/recentSchema";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("recent");

    const body = await readBody(event);
    const { error, value } = recentSchema.validate(body);

    const existingRecord = await collection.findOne({
      userId: value.userId,
      boardId: value.boardId,
    });

    if (existingRecord) {
      await collection.updateOne(
        { userId: value.userId, boardId: value.boardId },
        { $set: { ...value} }
      );
      value._id = existingRecord._id;
    } else {
      await collection.insertOne(value);
    }
    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
  } catch (error) {
    console.log(error);
  }
});
