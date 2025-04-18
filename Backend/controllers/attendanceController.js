import Attendance from "../models/AttendanceModel.js";
import Student from "../models/StudentModel.js";
import { sendSMS } from "../smsSender.js"; 

export const markAttendance = async (req, res) => {
  const { class: className, date, students } = req.body;

  try {
    const existing = await Attendance.findOne({ class: className, date });

    if (existing) {
      existing.students = students;
      await existing.save();
      return res.json({ success: true, message: "Attendance updated" });
    }

    const newAttendance = new Attendance({ class: className, date, students, facultyId: req.user?.id || null, });
    await newAttendance.save();
    res.status(201).json({ success: true, message: "Attendance recorded" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error marking attendance" });
  }
};

export const viewAttendance = async (req, res) => {
  const { class: className, date } = req.query;
  try {
    const records = await Attendance.find({
      class: className,
      date: { $gte: new Date(date), $lt: new Date(date).setHours(23,59,59,999) },
    }).populate("students.studentId", "name register gender");

    res.status(200).json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
};

export const sendMessageToParent = async (req, res) => {
  const { studentId, message } = req.body;

  if (!studentId || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const student = await Student.findById(studentId);

    if (!student || !student.phone) {
      return res.status(404).json({ success: false, message: "Student or phone number not found" });
    }
    console.log("Phone number:", student.phone);

    const result = await sendSMS(student.phone, message);

    if (result.success) {

      res.status(200).json({ success: true, message: "Message sent to parent" });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getClassReport = async (req, res) => {
  const { fromDate, toDate, class: className } = req.query;

  try {
    if (!fromDate || !toDate || !className) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find all students in that class (case-insensitive)
    const students = await Student.find({
      class: { $regex: new RegExp(className, "i") },
    });

    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found for this class" });
    }

    // Fetch attendance records for the class and date range
    const attendanceRecords = await Attendance.find({
      class: { $regex: new RegExp(className, "i") },
      date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    });

    // Map student statistics
    const studentStats = students.map((student) => {
      let totalPeriods = 0;
      let presentCount = 0;

      attendanceRecords.forEach((record) => {
        const studentData = record.students.find(
          (s) => s.studentId?.toString() === student._id.toString()
        );
        if (studentData) {
          const periods = studentData.periods || [];
          totalPeriods += periods.length;
          presentCount += periods.filter((p) => p.status === "Present").length;
        }
      });

      const percentage = totalPeriods ? (presentCount / totalPeriods) * 100 : 0;

      return {
        _id: student._id,
        name: student.name,
        register: student.register,
        class: student.class,
        totalPeriods,
        presentCount,
        percentage,
      };
    });

    res.status(200).json({ success: true, data: studentStats });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ success: false, message: "Server error generating report" });
  }
};

export const getStudentReport = async (req, res) => {
  const { studentId } = req.params;

  try {

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const attendanceRecords = await Attendance.find({
      "students.studentId": student._id,
    });

    let totalPeriods = 0;
    let presentCount = 0;

    attendanceRecords.forEach((record) => {
      const data = record.students.find(
        (s) => s.studentId.toString() === student._id.toString()
      );
      if (data) {
        totalPeriods += data.periods.length;
        presentCount += data.periods.filter((p) => p.status === "Present").length;
      }
    });

    const percentage = totalPeriods ? (presentCount / totalPeriods) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        register: student.register,
        class: student.class,
        totalPeriods,
        presentCount,
        absentCount: totalPeriods - presentCount,
        percentage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const fetchAttendance = async (req, res) => {
  const { class: cls, subject, date } = req.query;
  const record = await Attendance.findOne({ class: cls, subject, date });

  if (!record) {
    return res.json({ exists: false });
  }

  res.json({ exists: true, attendance: record });
};
