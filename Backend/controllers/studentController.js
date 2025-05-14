import Student from "../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator"; 
export const addStudent = async (req, res) => {
  const { name, department, year, section, dob, register, password, email, phone, gender } = req.body;

  try {
    const existing = await Student.findOne({ register, email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Student with this register number already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a Valid Email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a Strong Password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({ name, department, year, section, dob, register, password: hashedPassword, email, phone, gender, role: "student" });

    await newStudent.save();

    res.status(201).json({ success: true, message: "Student added", student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user, message: "Login successful" });
    console.log(res.data);

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
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