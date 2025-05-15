import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from "mongodb";
import { editPostSchema } from "~/utils/post/editPostSchema";
import { clearCache } from "~/utils/cache";

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event);

    if (!id || typeof id !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "Post ID is required and must be a string",
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection("post");

    const body = await readBody(event);
    const { error, value } = editPostSchema.validate(body);
    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...value } }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }
    const cacheKey = `post-board:${result.boardId}`;
    await clearCache(cacheKey);
    return {
      message: "Post updated successfully",
      data: value,
    };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
