import { MongoClient } from 'mongodb';

let client :any;
let db :any;

export async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
}
