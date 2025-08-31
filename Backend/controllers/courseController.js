import Course from "../models/courseModel.js";

// Add new course
export const addCourse = async (req, res) => {
  try {
    const { courseName, subjects } = req.body;

    if (!courseName || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Course name and subjects are required" });
    }

    const newCourse = new Course({ courseName, subjects });
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, courses});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching courses", error: error.message });
  }
};

export const updateCourse = async (req,res) => {
  const { id } = req.params;
  const { courseName, subjects } = req.body;

  try {
    const updatedCourse = await Course.findbyIdAndUpdate(
      id,
      { courseName, subjects },
      {new: true}
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course updated", course: updatedCourse });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error Updating Course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error Deleting Course" });
  }
}