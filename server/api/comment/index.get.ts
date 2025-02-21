import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const { postId } = getQuery(event);

  if (!postId || typeof postId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required and must be a string'
    });
  }

  const db = await connectToDatabase();
  const collection = db.collection('comment');
  const posts = await collection.find({ postId: postId }).sort({ createdAt: 1 }).toArray();

  return posts;
}
  catch(error){
    return error
  }
});