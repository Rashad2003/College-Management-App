import College from "../models/collegRegisterModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const collegeRegister = async (req,res) => {
    try {
        const {collegeName, collegeCode, name, email, password} = req.body;

        if (!collegeName || !collegeCode || !name || !email || !password) {
          return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingEmail = await College.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
        
         const existing = await College.findOne({ collegeName, collegeCode });
    if (existing) {
      return res.status(400).json({ success: false, message: "College already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a Valid Email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCollege = new College({
      collegeName,
      collegeCode,
      admin: [
        {
          name,
          email,
          password: hashedPassword,
          role: "Admin"
        }
      ]
    });

        await newCollege.save();

        const token = jwt.sign(
            { email, role: "Admin", collegeId: newCollege._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

         res.status(201).json({
      success: true,
      message: "College registered successfully",
      college: newCollege,
      token,
    });

    } catch (error) {
    res.status(500).json({ message: "Error registering college", error: error.message });        
    }
};

export const getCollege = async (res,req) => {
    try {
      const { code } = req.params;
        const college = await College.find({ collegeCode: code });
        if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }
        res.status(200).json({ success: true, college});
    } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching college", error: error.message });        
    }
};