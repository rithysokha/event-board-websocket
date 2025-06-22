
import { connectToDatabase } from '~/utils/mongodb';
import { registerSchema } from "~/utils/user/registerValidation";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = await connectToDatabase();
  const collection = db.collection('user');
  let errorMessage = "Error creating user";
  try {
    const { error, value } = registerSchema.validate(body)
    if (error) {
      throw createError({ statusCode: 400, message: error.details[0].message });
    }
    const existingUser = await collection.findOne({ email: value.email })
    if(existingUser){
      errorMessage="Username is already taken"
      throw createError({statusCode:400, message:errorMessage})
    }
    const user = {
      email: value.email,
      name: value.email,
      image:value.image,
      password: value.password,
      role: value.role,
      createdAt: new Date(),
      ...(value.termAndCondition === true && { acceptTermsAt: new Date() })
    }
    const result = await collection.insertOne(user);
    return result;
  } catch (error) {
    throw createError({ statusCode: 400, message: errorMessage });
  }
});
