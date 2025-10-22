import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

/**
 * 🟢 Crear una nueva orden
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "La orden debe tener al menos un producto" });
    }

    const order = await Order.create({
      items,
      total,
      status: "created",
      paymentStatus: "unpaid",
    });

    res.status(201).json({
      message: "Orden creada correctamente ✅",
      order,
    });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ message: "Error al crear la orden" });
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
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("❌ Error al listar órdenes:", error);
    res.status(500).json({ message: "Error al obtener las órdenes" });
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
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Error al obtener orden:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

/**
 * 🟡 Actualizar estado de la orden
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      message: "Orden actualizada correctamente",
      order,
    });
  } catch (error) {
    console.error("❌ Error al actualizar orden:", error);
    res.status(500).json({ message: "Error al actualizar la orden" });
  }
};

/**
 * 🔴 Eliminar una orden (opcional)
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    await order.destroy();
    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar orden:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
