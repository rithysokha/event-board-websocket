import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  const {belongsTo} = getRouterParams(event)
  const db = await connectToDatabase();
  const collection = db.collection('board');
    const items = await collection.find({belongsTo}).toArray();
    return items;
});
