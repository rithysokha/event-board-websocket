import { connectToDatabase } from '~/utils/mongodb';
import { getCache, setCache } from '~/utils/cache'

export default defineEventHandler(async (event) => {
  try{
   const cacheKey = 'avatar'
  const cached = await getCache(cacheKey)
   if (cached) {
    return cached
  }
  const db = await connectToDatabase();
  const collection = db.collection('avatar');
  const avatar = await collection.find().toArray();
  await setCache(cacheKey, avatar, 1440)
  return avatar;
}
  catch(error){
    return error
  }
});