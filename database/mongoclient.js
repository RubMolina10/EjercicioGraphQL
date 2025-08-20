import { MongoClient } from "mongodb";
import { successMessages } from "../messages/messages.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;
const DATABASE_NAME =process.env.MONGO_DB;

const client = new MongoClient(MONGODB_URI);

async function connect() {
  if (!client.isConnected?.()) {
    await client.connect();
    console.log(successMessages.DATABASECONECTED);
  }
  return client.db(DATABASE_NAME);
}

export { connect };
