import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  minBookingLength: { type: Number, required: true },
  maxBookingLength: { type: Number, required: true },
  maxGuestsPerBooking: { type: Number, required: true },
  breakfastPrice: { type: Number, required: true },
});

const Setting = mongoose.model("settings", settingSchema);
export default Setting;
