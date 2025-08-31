import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, // optional field
});

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, unique: true },
  subjects: [subjectSchema], // array of subjects
}, { timestamps: true });


const Course = mongoose.model.Course || mongoose.model("Course", courseSchema);
export default Course;