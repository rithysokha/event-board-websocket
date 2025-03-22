import { connectToDatabase } from "~/utils/mongodb";
import { presetSchema } from "~/utils/preset/presetValidation";
export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("preset");

    const body = await readBody(event);
    const { error, value } = presetSchema.validate(body);

    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const result = await collection.insertOne(value);
    return result;
  } catch (error) {
    console.log(error);
  }
});
