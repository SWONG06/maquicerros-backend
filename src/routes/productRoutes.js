import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controllers/productController.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", getAllProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Crear producto nuevo
router.post("/", createProduct);

// Actualizar producto completo
router.put("/:id", updateProduct);

// Actualizar solo el stock
router.put("/:id/stock", updateStock);

// Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
