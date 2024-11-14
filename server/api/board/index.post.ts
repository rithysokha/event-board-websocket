import { connectToDatabase } from '~/utils/mongodb';
import { boardSchema } from '~/utils/board/boardValidation';

export default defineEventHandler(async (event) => {
  try{
  const db = await connectToDatabase();
  const collection = db.collection('board');
  
  const body = await readBody(event);
  const { error, value } = boardSchema.validate(body);
  
  if (error) {
    throw createError({ statusCode: 400, message: error.details[0].message });
  }
  const result = await collection.insertOne(value);
  return result;
}catch(error){
  console.log(error)
}
});
