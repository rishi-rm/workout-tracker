import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/workout";

    await mongoose.connect(uri);

    console.log("DB connected");
  } catch (e) {
    console.error("DB connection error:", e);
    process.exit(1);
  }
};