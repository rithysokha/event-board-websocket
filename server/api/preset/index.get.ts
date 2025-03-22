import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const db = await connectToDatabase();
  const collection = db.collection('preset');
  const posts = await collection.find().sort({ createdAt: 1 }).toArray();
  return posts;
}
  catch(error){
    return error
  }
});