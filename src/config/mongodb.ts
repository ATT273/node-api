import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const db_password = process.env.DB_PASSWORD;
const db_username = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const MONGODB_URI = `mongodb+srv://${db_username}:${db_password}@next-crm.edriz.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=next-crm`;

let crmDatabaseInstance = null;
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoose.connect(MONGODB_URI);
};

export const GET_DB = () => {
  if (!crmDatabaseInstance) {
    throw new Error("Must connect to database first");
  }
  return crmDatabaseInstance;
};
