import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Crear orden
router.post("/", createOrder);

// Obtener todas las órdenes
router.get("/", getAllOrders);

// Obtener una orden por ID
router.get("/:id", getOrderById);

// Actualizar estado o pago
router.put("/:id", updateOrderStatus);

// Eliminar una orden (opcional)
router.delete("/:id", deleteOrder);

export default router;
