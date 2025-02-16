import { connectToDatabase } from "~/utils/mongodb";
import { postSchema } from "~/utils/post/postValidation";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("post");

    const body = await readBody(event);
    const { error, value } = postSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const result = await collection.insertOne(value);
    return result;
  } catch (error) {
    console.log(error);
  }
});
