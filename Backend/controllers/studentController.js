import Student from "../models/studentModel.js";

export const addStudent = async (req, res) => {
  const { name, department, year, section, dob, register, email, phone, gender } = req.body;

  try {
    const existing = await Student.findOne({ register, email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Student with this register number already exists" });
    }

    const newStudent = new Student({ name, department, year, section, dob, register, email, phone, gender, role: "student" });

    await newStudent.save();

    res.status(201).json({ success: true, message: "Student added", student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, department, year, section, dob, register, password, email, phone, gender } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, department, year, section, dob, register, password, email, phone, gender },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student updated", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating student" });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting student" });
  }
};