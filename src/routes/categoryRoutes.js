import { Router } from "express";
import { authJWT } from "../middleware/authJWT.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = Router();

// Público
router.get("/", getCategories);

// Solo admin
router.post("/", authJWT, isAdmin, createCategory);
router.put("/:id", authJWT, isAdmin, updateCategory);
router.delete("/:id", authJWT, isAdmin, deleteCategory);

export default router;
