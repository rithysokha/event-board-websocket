import { connectToDatabase } from '~/utils/mongodb';
import { commentSchema } from '~/utils/comment/commentValidation';

export default defineEventHandler(async (event) => {
  try{
  const db = await connectToDatabase();
  const collection = db.collection('comment');
  
  const body = await readBody(event);
  const { error, value } = commentSchema.validate(body);
  
  if (error) {
    throw createError({ statusCode: 400, message: error.details[0].message });
  }
  const result = await collection.insertOne(value);
  return result;
}catch(error){
  console.log(error)
}
});
