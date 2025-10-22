import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priceAtAddition: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

export default CartItem;
