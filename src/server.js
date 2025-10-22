import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, connectDB } from "./config/db.js";
import "./models/Order.js";
import "./models/Payment.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas estáticas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conectar BD
connectDB();
await sequelize.sync({ alter: true });

// Rutas API
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API Maquicerros funcionando correctamente con MySQL + Sequelize");
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
