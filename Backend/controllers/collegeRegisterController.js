import College from "../models/collegRegisterModel.js";
import validator from "validator";

export const collegeRegister = async (req,res) => {
    try {
        const {collegeName, collegeCode, email, password, role} = req.body;

         const existing = await College.findOne({ collegeName, collegeCode });
    if (existing) {
      return res.status(400).json({ success: false, message: "College already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a Valid Email" });
    }

        const newCollege = new College ({ collegeName, collegeCode, email, password, role: "Admin" });
        await newCollege.save();

        res.status(201).json({ message: "College Register successfully", college: newCollege });

    } catch (error) {
    res.status(500).json({ message: "Error registering college", error: error.message });        
    }
};

export const getCollege = async (res,req) => {
    try {
        const college = await College.find();
        res.status(200).json({ success: true, college});
    } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching college", error: error.message });        
    }
};