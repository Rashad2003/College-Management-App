import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    collegeName: { type: String, required: true },
    collegeCode: { type: String, required: true, unique: true  },
    email: { type: String, required: true, unique: true  },
    password: { type: String, required: true },
    role: { type: String },
});

const College = mongoose.model.College || mongoose.model("College", collegeSchema);
export default College;