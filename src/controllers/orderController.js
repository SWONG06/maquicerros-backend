// src/controllers/orderController.js
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

/**
 * 🟢 Crear una nueva orden
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total, userId } = req.body;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "La orden debe tener al menos un producto" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: "El total de la orden no es válido" });
    }

    // Crear orden
    const order = await Order.create({
      items,
      total,
      userId: userId || null,
      status: "created",
      paymentStatus: "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "✅ Orden creada correctamente",
      order,
    });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la orden",
      error: error.message,
    });
  }
};

/**
 * 🔵 Obtener todas las órdenes (con pagos)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "status", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Error al listar órdenes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las órdenes",
      error: error.message,
    });
  }
};

/**
 * 🟣 Obtener una orden por ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: Payment, as: "payments" }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Error al obtener orden:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al obtener la orden",
      error: error.message,
    });
  }
};

/**
 * 🟡 Actualizar estado o pago de una orden
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    return res.json({
      success: true,
      message: "✅ Orden actualizada correctamente",
      order,
    });
  } catch (error) {
    console.error("❌ Error al actualizar orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la orden",
      error: error.message,
    });
  }
};

/**
 * 🔴 Eliminar una orden (opcional)
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }

    await order.destroy();

    return res.json({
      success: true,
      message: "🗑️ Orden eliminada correctamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la orden",
      error: error.message,
    });
  }
};
