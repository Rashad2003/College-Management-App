import mongoose from "mongoose";

const studymaterialSchema = new mongoose.Schema(
    {
      title: { type: String, required: true }, // Example: "Data Structures Notes"
      department: { type: String, enum: ["IT", "CSE", "ECE", "MECH", "All"], required: true },
      year: { type: String, enum: ["1", "2", "3", "4"], required: true }, // Add year field
      pdfFile: { type: String, required: true }, // Store PDF file path
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
  );

  const StudyMaterial = mongoose.model.StudyMaterial || mongoose.model("StudyMaterial", studymaterialSchema);
  export default StudyMaterial;