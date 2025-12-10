import mongoose from "mongoose";

let isConnected = false;

async function connectDB(mongoURL) {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(mongoURL);
    isConnected = true;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export default connectDB;
