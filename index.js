import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const handler = app;
export default handler;
