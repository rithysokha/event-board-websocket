import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{


  const db = await connectToDatabase();
  const collection = db.collection('avatar');
  const posts = await collection.find().toArray();

  return posts;
}
  catch(error){
    return error
  }
});