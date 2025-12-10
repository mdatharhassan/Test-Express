import mongoose from "mongoose";
import Cabin from "./cabinModel.js";
import Guest from "./guestModel.js";

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  cabinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cabins",
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "guests",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  hasBreakfast: { type: Boolean, required: true },
  observations: { type: String },
  isPaid: { type: Boolean, required: true },
  numGuests: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["unconfirmed", "checked-in", "checked-out"],
    default: "unconfirmed",
  },
  // totalPrice: { type: Number, required: true },
  // status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
