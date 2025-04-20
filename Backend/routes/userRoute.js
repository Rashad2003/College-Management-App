import express from "express";
import { deleteUser, listUser, loginUser, registerUser, updateUser, forgotPassword, requestPasswordReset, resetPassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/list", listUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
