




import mongoose from "mongoose";

export default async function connection() {
  try {
    const db = await mongoose.connect(
      "mongodb://127.0.0.1:27017/TASKMANAGEMENTSYSTEM"
    );

    console.log("database created");
    return db;
  } catch (error) {
    console.log("Database connection error:", error.message);
  }
}