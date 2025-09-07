import express from "express";
import { collegeRegister, getCollege } from "../controllers/collegeRegisterController.js";

const router = express.Router();

router.post("/add", collegeRegister);
router.get("/get/:code", getCollege);

export default router;