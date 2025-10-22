import db from "../models/index.js";
import { Sequelize } from "sequelize";

// ✅ Dashboard general
export const getDashboardSummary = async (req, res) => {
  try {
    // Totales principales
    const totalVentas = await db.Order.sum("total", {
      where: { payment_status: "PAGADO" }
    });

    const totalPedidos = await db.Order.count();
    const totalUsuarios = await db.User.count();

    // Ventas por mes
    const ventasPorMes = await db.Order.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "mes"],
        [Sequelize.fn("SUM", Sequelize.col("total")), "total"]
      ],
      where: { payment_status: "PAGADO" },
      group: ["mes"],
      order: [["mes", "ASC"]]
    });

    // Productos más vendidos
    const topProductos = await db.OrderItem.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalVendido"]
      ],
      group: ["productId"],
      order: [[Sequelize.literal("totalVendido"), "DESC"]],
      limit: 5,
      include: [{ model: db.Product, attributes: ["name", "brand", "price"] }]
    });

    // Stock bajo
    const stockBajo = await db.Product.findAll({
      where: { stock: { [Sequelize.Op.lt]: 5 } },
      attributes: ["id", "name", "stock"]
    });

    res.json({
      totalVentas: totalVentas || 0,
      totalPedidos,
      totalUsuarios,
      ventasPorMes,
      topProductos,
      stockBajo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo datos del dashboard", error: error.message });
  }
};
