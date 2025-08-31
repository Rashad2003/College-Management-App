import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Example: "Mid-Term Exams"
    department: { type: String, enum: ["IT", "CSE", "ECE", "MECH", "All"], required: true },
    year: { type: String, enum: ["1", "2", "3", "4"], required: true }, // Add year field
    section: { type: String, enum: ["A", "B", "C"], required: true }, // Add section field
    examType: { type: String, enum: ["CAT1", "CAT2"], required: true }, // Add examType field
    pdfFile: { type: String, required: true }, // Store PDF file path
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Timetable = mongoose.model.Timetable || mongoose.model("Timetable", timetableSchema);
  export default Timetable;