import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  register: String,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phone: String,
  email: { type: String, unique: true },
  department: String,
year: String,
section: String,
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
