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

  export const listSubject = async (req, res) => {
    const { department, year, semester } = req.query;
    try {
      const subjects = await Subject.find({ department, year, semester });
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  }