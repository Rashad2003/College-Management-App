import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Admin" }
  });
  
  const collegeSchema = new mongoose.Schema({
    collegeName: { type: String, required: true },
    collegeCode: { type: String, required: true, unique: true },
    admin: [adminSchema]   // embedded array of admins
  });

const College = mongoose.model.College || mongoose.model("College", collegeSchema);
export default College;