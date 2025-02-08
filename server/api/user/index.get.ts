import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const db = await connectToDatabase();
  const collection = db.collection('user');
  const users = await collection.find({}).sort({ createdAt: 1 }).toArray();

  if (!users.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No users found for this board'
    });
  }
  return users;
}
  catch(error){
    return error
  }
});