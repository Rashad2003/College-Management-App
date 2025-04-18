import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
  periodNumber: Number,
  status: { type: String, enum: ["Present", "Absent", "Late"], default: "Present" },
});

const studentAttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  register: String,
  name: String,
  class: String,
  periods: [periodSchema],
});

const attendanceSchema = new mongoose.Schema({
  class: { type: String, required: true },
  date: { type: Date, required: true },
  students: [studentAttendanceSchema],
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
