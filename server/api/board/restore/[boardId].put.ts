import { connectToDatabase } from "~/utils/mongodb";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const { boardId } = getRouterParams(event);
    
    if (!boardId || typeof boardId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Board ID is required and must be a string'
      });
    }

    const db = await connectToDatabase();
    const boardCollection = db.collection("board");

    const board = await boardCollection.findOne({ 
      _id: new ObjectId(boardId),
      deletedAt: { $exists: true }
    });

    if (!board) {
      throw createError({
        statusCode: 404,
        message: 'Deleted board not found'
      });
    }

    // Restore the board by removing the deletedAt field
    const result = await boardCollection.updateOne(
      { _id: new ObjectId(boardId) },
      { $unset: { deletedAt: "" } }
    );

    if (result.modifiedCount === 0) {
      throw createError({
        statusCode: 500,
        message: 'Failed to restore the board'
      });
    }

    return {
      statusCode: 200,
      message: 'Board restored successfully',
      data: {
        boardId,
        name: board.name
      }
    };
  } catch (error) {
    console.error('Error restoring board:', error);
    throw createError({ 
      statusCode:  500, 
      message: 'Internal Server Error' 
    });
  }
});