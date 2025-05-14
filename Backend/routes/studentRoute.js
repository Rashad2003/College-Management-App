import express from "express";
import {
  addStudent,
  listStudents,
  updateStudent,
  deleteStudent,
  loginStudent,
} from "../controllers/studentController.js";

import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add",authMiddleware, addStudent);
router.get("/list",authMiddleware,  listStudents);
router.put("/update/:id", authMiddleware, roleMiddleware(["Admin"]), updateStudent);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["Admin"]), deleteStudent);
router.post("/login", loginStudent);

export default router;
