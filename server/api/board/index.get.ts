import { connectToDatabase } from '~/utils/mongodb';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  const { boardId } = getQuery(event);

  if (!boardId || typeof boardId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Board ID is required and must be a string'
    });
  }

  const db = await connectToDatabase();
  const collection = db.collection('board');
  const board = await collection.findOne({ _id: new ObjectId(boardId) });

  if (!board) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Board not found'
    });
  }

  return board;
});