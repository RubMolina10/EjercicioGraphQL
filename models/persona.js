// Este archivo define la colección "persons"
import { connect } from "../database/mongoclient.js";

async function getCollection() {
  const db = await connect();
  return db.collection("persons");
}

export { getCollection };
