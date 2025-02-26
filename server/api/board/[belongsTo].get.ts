import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const {belongsTo} = getRouterParams(event)
  const db = await connectToDatabase();
  const collection = db.collection('board');
    const items = await collection.find({belongsTo}).toArray();
    return items;
  }catch(error){
    console.log(error)
  }
});
