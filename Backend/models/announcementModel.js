import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      message: { type: String, required: true },
      department: { type: String, enum: ["IT", "CSE", "ECE", "MECH", "All"], default: "All" }, // College-wide or department-specific
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    { timestamps: true }
  );

  const Announcement = mongoose.model.Announcement || mongoose.model("Announcement", announcementSchema);
  export default Announcement;