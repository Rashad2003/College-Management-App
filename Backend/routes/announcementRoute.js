import express from "express";
import { createAnnouncement, getAnnouncements } from "../controllers/announcementController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/add", authMiddleware, createAnnouncement);
router.get("/get", authMiddleware, getAnnouncements);

export default router;