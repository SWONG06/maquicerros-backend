import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Payment from "./Payment.js"; // 👈 Importa el modelo Payment

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // 🔹 Datos del cliente
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 🔹 Detalles de la orden
    items: {
      type: DataTypes.JSON, // Productos del carrito
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔹 Estado
    status: {
      type: DataTypes.ENUM("created", "processing", "completed", "cancelled"),
      defaultValue: "created",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "refunded"),
      defaultValue: "unpaid",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

// 🔗 Relaciones con Payment
Order.hasMany(Payment, {
  as: "payments", // alias usado en include
  foreignKey: "orderId", // FK en payments
  onDelete: "CASCADE",
});

Payment.belongsTo(Order, {
  foreignKey: "orderId",
});

export default Order;
