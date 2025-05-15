import { connectToDatabase } from "~/utils/mongodb";
import { getCache, setCache } from "~/utils/cache";

export default defineEventHandler(async (event) => {
  try {
    const cacheKey = "preset";
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const db = await connectToDatabase();
    const collection = db.collection("preset");
    const preset = await collection.find().sort({ createdAt: 1 }).toArray();
    setCache(cacheKey, preset, 1440);
    return preset;
  } catch (error) {
    return error;
  }
});
