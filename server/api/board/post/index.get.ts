import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const { boardId } = getQuery(event);

  if (!boardId || typeof boardId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Board ID is required and must be a string'
    });
  }

  const db = await connectToDatabase();
  const collection = db.collection('post');
  const posts = await collection.find({ boardId: boardId }).sort({ createdAt: 1 }).toArray();

  return posts;
}
  catch(error){
    return error
  }
});