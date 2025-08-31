import express from "express";
import { getResults, uploadResult } from "../controllers/resultController.js";
import { setUploadType, upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, setUploadType("result"), upload.single("pdfFile"), uploadResult);
router.get("/get", authMiddleware, getResults);

export default router;
