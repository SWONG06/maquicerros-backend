import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, connectDB } from "./config/db.js";

// Importar modelos
import "./models/Order.js";
import "./models/Payment.js";
import "./models/Product.js";

// Importar rutas
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🖼️ Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔗 Rutas API
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

// 🧪 Ruta base
app.get("/", (req, res) => {
  res.send("🚀 API Maquicerros funcionando correctamente con MySQL + Sequelize");
});

const PORT = process.env.PORT || 5000;

// 🚀 Envolver el arranque en una función async
const startServer = async () => {
  try {
    console.log("🟡 Conectando a la base de datos...");
    await connectDB();
    await sequelize.sync(); // ⚡ más rápido que alter:true

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
