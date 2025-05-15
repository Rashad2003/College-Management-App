import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import {connectDB} from "./config/db.js";
import subjectRoutes from "./routes/subjectRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subject", subjectRoutes);

connectDB();

const PORT = process.env.PORT || 5001;

app.get("/",(req,res)=> res.send("API Working!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
