import express from "express";
import { getTimetables, uploadTimetable } from "../controllers/timetableController.js";
import { setUploadType, upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, setUploadType("timetable"), upload.single("pdfFile"), uploadTimetable);
router.get("/get", authMiddleware, getTimetables);
export default router;