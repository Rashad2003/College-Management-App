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
    try {
      const { department, year, semester } = req.query;
      const query = {};
  
      if (department) query.department = department;
      if (year) query.year = year;
      if (semester) query.semester = semester;
  
      const subjects = await Subject.find(query);
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  }