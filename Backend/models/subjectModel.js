import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  department: { type: String, required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  type: { type: String, enum: ['Theory', 'Practical'], required: true },
});

export default mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

