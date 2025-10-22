import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.ENUM("unidad", "caja", "kg", "litro", "galon","par"),
    defaultValue: "unidad",
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.1,
    },
  },
  discountType: {
    type: DataTypes.ENUM("percent", "amount", "none"),
    defaultValue: "none",
  },
  discountValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false, // porque imagen es obligatoria
  },
  imagePublicId: {
    type: DataTypes.STRING, // Cloudinary
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("available", "out_of_stock"),
    defaultValue: "available",
  },
});

export default Product;
