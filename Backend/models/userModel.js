import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  dob: Date,
  address: String,
  password: String,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  role: { type: String, enum: ["Admin", "Faculty"] },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
