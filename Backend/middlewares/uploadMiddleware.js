import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = path.join(__dirname, "uploads"); // Default

    if (req.uploadType === "timetable")
      uploadFolder = path.join(__dirname, "uploads/timetables");
    else if (req.uploadType === "result")
      uploadFolder = path.join(__dirname, "uploads/results");
    else if (req.uploadType === "studyMaterial")
      uploadFolder = path.join(__dirname, "uploads/studyMaterials");

    // Ensure folder exists
    fs.mkdirSync(uploadFolder, { recursive: true });

    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

export const setUploadType = (uploadType) => (req, res, next) => {
  req.uploadType = uploadType;
  next();
};

export const upload = multer({ storage, fileFilter });
