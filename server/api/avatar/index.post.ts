import { connectToDatabase } from "~/utils/mongodb";
import { avatarSchema } from "../../../utils/avatar/avatarValidation";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("avatar");

    const body = await readBody(event);
    const { error, value } = avatarSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const result = await collection.insertOne(value);
    return result;
  } catch (error) {
    console.log(error);
  }
});
