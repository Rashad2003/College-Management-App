import Student from "../models/studentModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const userCount = await User.countDocuments();
    const classList = await Student.distinct("class");
    const classCount = classList.length;

    res.json({
      success: true,
      data: {
        studentCount,
        userCount,
        classCount,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
