import { sequelize } from "../config/db.js";
import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import PasswordResetToken from "./PasswordResetToken.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Payment from "./Payment.js";


const db = {};

db.sequelize = sequelize;
db.User = User;
db.Category = Category;
db.Product = Product;
db.PasswordResetToken = PasswordResetToken;
db.Cart = Cart;
db.CartItem = CartItem;
db.Order = Order;
db.OrderItem = OrderItem;
db.Payment = Payment;

// ✅ RELACIONES

// Categorías y productos
db.Category.hasMany(db.Product, { foreignKey: "categoryId", onDelete: "SET NULL" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId" });

// Usuario y carrito
db.User.hasOne(db.Cart, { foreignKey: "userId", onDelete: "CASCADE" });
db.Cart.belongsTo(db.User, { foreignKey: "userId" });

// Carrito y productos
db.Cart.hasMany(db.CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
db.CartItem.belongsTo(db.Cart, { foreignKey: "cartId" });

db.Product.hasMany(db.CartItem, { foreignKey: "productId" });
db.CartItem.belongsTo(db.Product, { foreignKey: "productId" });

// ✅ Usuario y pedidos
db.User.hasMany(db.Order, { foreignKey: "userId" });
db.Order.belongsTo(db.User, { foreignKey: "userId" });

// ✅ Pedido y productos (OrderItems)
db.Order.hasMany(db.OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId" });

db.Product.hasMany(db.OrderItem, { foreignKey: "productId" });
db.OrderItem.belongsTo(db.Product, { foreignKey: "productId" });

// Relación Pago - Orden
db.Order.hasOne(db.Payment, { foreignKey: "orderId" });
db.Payment.belongsTo(db.Order, { foreignKey: "orderId" });

export default db;
