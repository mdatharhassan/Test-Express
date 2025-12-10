import express from "express";
import connectDB from "./config/mongoDB";
const app = express();
app.get("/", (req, res) => {
  res.send("Backend is running");
});

connectDB(process.env.MONGO_URL);

const handler = app;
export default handler;
