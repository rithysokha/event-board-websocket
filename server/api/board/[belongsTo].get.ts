import { connectToDatabase } from '~/utils/mongodb';

export default defineEventHandler(async (event) => {
  try{
  const {belongsTo} = getRouterParams(event)
  const {deleted} = getQuery(event)
  const db = await connectToDatabase();
  const collection = db.collection('board');
    const items = await collection.find(
      {belongsTo: belongsTo,
        deletedAt:{$exists: deleted == 'true'}
      }    
    ).toArray();
    return items;
  }catch(error){
    console.log(error)
  }
});
