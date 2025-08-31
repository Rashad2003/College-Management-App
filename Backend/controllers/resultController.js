import Result from "../models/resultModel.js";
import Student from "../models/studentModel.js";

// Upload Student Results
export const uploadResult = async (req, res) => {
  try {
    if (req.user.role === "Student") {
      return res.status(403).json({ message: "Only faculty can upload results" });
    }

    const { studentId, semester, percentage } = req.body;

    if (!studentId || !semester || percentage === undefined) {
      return res.status(400).json({ message: "Student ID, semester, and percentage are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const result = await Result.create({
      student: studentId,
      semester,
      percentage,
      uploadedBy: req.user.id,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Results
export const getResults = async (req, res) => {
  try {
    let results;

    if (req.user.role === "Faculty" || req.user.role === "Admin" || req.user.role === "Student") {
      // Faculty can see all results
      results = await Result.find().populate("student uploadedBy", "name email").sort({ createdAt: -1 });
    } else {
      // Students can see their own results
      results = await Result.find({ student: req.user._id })
        .populate("uploadedBy student", "name email")
        .sort({ createdAt: -1 });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};