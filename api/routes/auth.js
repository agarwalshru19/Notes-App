import express from "express";
import { register, login, logout } from "../controllers/auth.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyToken, logout);

export default router;
