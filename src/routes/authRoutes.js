import { Router } from "express";
import { register, login, profile } from "../controllers/authController.js";
import { authJWT } from "../middleware/authJWT.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authJWT, profile); // ✅ ruta protegida

export default router;
