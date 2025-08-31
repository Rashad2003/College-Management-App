import express from "express";
import { setUploadType, upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getStudyMaterials, uploadStudyMaterial } from "../controllers/studymaterialController.js";

const router = express.Router();

router.post("/add", authMiddleware, setUploadType("result"), upload.single("pdfFile"), uploadStudyMaterial);
router.get("/get", authMiddleware, getStudyMaterials);

export default router;