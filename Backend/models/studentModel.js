import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  register: String,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phone: String,
  dob: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
year: String,
section: String,
role: String,
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
