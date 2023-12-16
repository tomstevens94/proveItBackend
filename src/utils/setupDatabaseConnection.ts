import "dotenv/config";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_CLUSTER,
} = process.env;

const uri = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.lxtgsbj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,

    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    console.log("Connecting to database. . .");
    await mongoose.connect(uri, { dbName: DATABASE_NAME });
    console.log("Connected to MongoDB/Mongoose");
  } catch (err) {
    console.log("Error connecting to db: ", err);
  } finally {
    console.log("Client closed/connections removed");
    await client.close();
  }
}

export const setupDatabaseConnection = () =>
  connectToDatabase().catch((err) =>
    console.log("Error connecting to database: ", err)
  );
