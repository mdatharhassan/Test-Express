import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  avatar: { type: String },
  // role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("users", userModel);
export default User;
