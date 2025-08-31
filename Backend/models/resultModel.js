import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Associate result with a student
      semester: { type: String, required: true }, // Example: "Semester 1"
      percentage: { type: Number, required: true, min: 0, max: 100 }, // Student's percentage
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Faculty who uploaded the result
    },
    { timestamps: true }
  );

  const Result = mongoose.model.Result || mongoose.model("Result", resultSchema);
  export default Result;