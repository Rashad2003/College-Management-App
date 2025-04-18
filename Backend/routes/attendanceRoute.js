import express from "express";
import {
  markAttendance,
  sendMessageToParent,
  viewAttendance,
  getClassReport,
  getStudentReport,
  fetchAttendance,
} from "../controllers/attendanceController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/mark", authMiddleware, markAttendance);
router.get("/view", viewAttendance);
router.post("/send", sendMessageToParent);
router.get("/class-report", getClassReport);
router.get("/student-report/:studentId", getStudentReport);
router.get("/fetch", fetchAttendance);


export default router;
