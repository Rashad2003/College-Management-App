import express from "express";
import { addCourse, deleteCourse, getCourses, updateCourse } from "../controllers/courseController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", addCourse);
router.get("/get", getCourses);
router.put("/update/:id", authMiddleware, roleMiddleware(["Admin"]), updateCourse);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["Admin"]), deleteCourse);

export default router;
