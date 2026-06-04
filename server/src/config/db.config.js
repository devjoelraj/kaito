import { MONGODB_URI } from "./env.config.js";
import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" DB Connection Failed:", error.message);
    process.exit(1);
  }
};
