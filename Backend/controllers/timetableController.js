import Timetable from "../models/timetableModel.js";

export const uploadTimetable = async (req, res) => {
  try {
    const { title, department, year, section, examType } = req.body;
    const pdfFile = req.file ? req.file.path : null;

    if (!pdfFile) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const timetable = await Timetable.create({
      title,
      department,
      year,
      section,
      examType,
      pdfFile,
      uploadedBy: req.user.id,
    });

    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

export const getTimetables = async (req, res) => {
  try {
    let timetables;

    if (req.user.role === "Faculty" || req.user.role === "Admin" || req.user.role === "Student") {
      timetables = await Timetable.find().sort({ createdAt: -1 });
    } else {
      timetables = await Timetable.find({
        $or: [{ department: "All" }, { department: req.user.department }],
      }).sort({ createdAt: -1 });
    }

    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};