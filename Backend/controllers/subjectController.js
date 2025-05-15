import Subject from "../models/subjectModel.js";

export const getAllSubjects = async (req, res) => {
    try {
      const { name, code, department, year, semester, type } = req.body;
      const subject = new Subject({ name, code, department, year, semester, type });
      await subject.save();
      res.status(201).json({ message: 'Subject added successfully', subject });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const listSubject = async (req,res) => {
    try {
      const subject = await Subject.find();
      res.status(200).json({ success: true, subject });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch subject" });
    }
  }