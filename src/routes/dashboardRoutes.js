import { Router } from "express";
import { authJWT, isAdmin } from "../middleware/authJWT.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";

const router = Router();

// ✅ Solo admin puede acceder
router.get("/summary", authJWT, isAdmin, getDashboardSummary);

export default router;
