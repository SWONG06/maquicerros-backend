import { Router } from "express";
import { authJWT } from "../middleware/authJWT.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/uploadImage.js";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  updateProductStock,
  updateProductImage,
  updateProductStatus
} from "../controllers/productController.js";


const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authJWT, isAdmin, upload.single("image"), createProduct);
router.put("/:id", authJWT, isAdmin, updateProduct);
router.delete("/:id", authJWT, isAdmin, deleteProduct);
router.patch("/:id/stock", authJWT, isAdmin, updateProductStock);
router.patch("/:id/image", authJWT, isAdmin, upload.single("image"), updateProductImage);
router.patch("/:id/status", authJWT, isAdmin, updateProductStatus);


export default router;
