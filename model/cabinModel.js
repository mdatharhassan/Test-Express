import mongoose from "mongoose";
const { Schema } = mongoose;

const cabinSchema = new Schema({
  name: { type: String, unique: true, required: [true, "Name is required"] },
  maxCapacity: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  image: { type: String },
  description: { type: String, required: true },
});

const Cabin = mongoose.model("cabins", cabinSchema);

export default Cabin;
