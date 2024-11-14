import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  const db = await connectToDatabase();
  const collection = db.collection('board');
    const items = await collection.find().toArray();
    return items;
});
