import mongoose from "mongoose";

const guestModel = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nationality: { type: String, required: true },
  nationalID: { type: String, required: true, unique: true },
  countryFlag: { type: String, required: true },
});

const Guest = mongoose.model("guests", guestModel);
export default Guest;
