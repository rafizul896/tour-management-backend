import mongoose from "mongoose";
import { envVars } from "./env";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const db = await mongoose.connect(envVars.DB_URL as string, {
      // connection pool ছোট রাখুন serverless এর জন্য
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected!");
  } catch (err) {
    isConnected = false;
    console.error("MongoDB Connection Error:", err);
    throw err; // caller (middleware) handle করবে, process.exit না
  }
};