import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🖼️ Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🧩 Importar modelos (en orden)
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import Product from "./models/Product.js";

// 🧭 Importar rutas
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// 🔗 Rutas API
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

// 🧪 Ruta base
app.get("/", (req, res) => {
  res.send("🚀 API Maquicerros funcionando correctamente con MySQL + Sequelize");
});

const PORT = process.env.PORT || 5000;

// 🚀 Función para iniciar el servidor
const startServer = async () => {
  try {
    console.log("🟡 Conectando a la base de datos...");
    await connectDB();

    // 🔁 Sincronizar todos los modelos y relaciones
    await sequelize.sync({ alter: true });
    console.log("🗄️ Base de datos sincronizada correctamente.");

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
