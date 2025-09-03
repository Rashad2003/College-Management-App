import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import {connectDB} from "./config/db.js";
import subjectRoutes from "./routes/subjectRoute.js";
import announcementRoutes from "./routes/announcementRoute.js";
import timetableRoutes from "./routes/timetableRoute.js";
import resultRoutes from "./routes/resultRoute.js";
import studymaterialRoutes from "./routes/studymaterialRoute.js";
import courseRoutes from "./routes/courseRoute.js";
import collegeRoutes from "./routes/collegeRegisterRoute.js";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/studyMaterial", studymaterialRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/college", collegeRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads/timetables", express.static(path.join(__dirname, "uploads/timetables")));
app.use("/uploads/results", express.static(path.join(__dirname, "uploads/results")));
app.use("/uploads/studyMaterials", express.static(path.join(__dirname, "uploads/studyMaterials")));

connectDB();

const PORT = process.env.PORT || 5001;

app.get("/",(req,res)=> res.send("API Working!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
