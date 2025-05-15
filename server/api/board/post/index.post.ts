import { connectToDatabase } from "~/utils/mongodb";
import { postSchema } from "~/utils/post/postValidation";
import { clearCache } from "~/utils/cache";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("post");

    const body = await readBody(event);
    const { error, value } = postSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const cacheKey = `post-board:${value.boardId}`
    await clearCache(cacheKey)
    const result = await collection.insertOne(value);
    return result;
  } catch (error) {
    console.log(error);
  }
});
