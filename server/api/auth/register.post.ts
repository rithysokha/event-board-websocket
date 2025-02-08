
import { connectToDatabase } from '~/utils/mongodb';
import { registerSchema } from "~/utils/user/registerValidation";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = await connectToDatabase();
  const collection = db.collection('user');
  try {
    const { error, value } = registerSchema.validate(body)
    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const user = {
      username: value.username,
      password: value.password,
      createdAt: new Date()
    }
    const result = await collection.insertOne(user);
    return result;
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: "Error creating user" });
  }
});
