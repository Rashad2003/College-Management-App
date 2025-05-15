import express from "express";
import { getAllSubjects, listSubject } from "../controllers/subjectController.js";
const router = express.Router();

router.post('/add', getAllSubjects);
router.get('/list', listSubject);

export default router;