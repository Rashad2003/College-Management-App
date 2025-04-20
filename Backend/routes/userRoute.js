import express from "express";
import { deleteUser, listUser, loginUser, registerUser, updateUser, forgotPassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/list", listUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);

export default router;
