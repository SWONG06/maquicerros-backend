import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * 🟢 Crear una nueva orden
 * POST /api/orders
 * Body: { items: [...], total: number }
 */
router.post("/", createOrder);

/**
 * 🔵 Obtener todas las órdenes
 * GET /api/orders
 */
router.get("/", getAllOrders);

/**
 * 🟣 Obtener una orden por ID
 * GET /api/orders/:id
 */
router.get("/:id", getOrderById);

/**
 * 🟡 Actualizar estado o pago de una orden
 * PUT /api/orders/:id
 * Body: { status?: string, paymentStatus?: string }
 */
router.put("/:id", updateOrderStatus);

/**
 * 🔴 Eliminar una orden (opcional)
 * DELETE /api/orders/:id
 */
router.delete("/:id", deleteOrder);

export default router;
