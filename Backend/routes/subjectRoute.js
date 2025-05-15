import express from "express";
import { getAllSubjects } from "../controllers/subjectController.js";
const router = express.Router();

router.post('/add', getAllSubjects); 

export default router;