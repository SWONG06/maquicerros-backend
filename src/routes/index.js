import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import webhookRoutes from "./webhookRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

// ✅ Webhook debe ir primero
router.use("/webhooks", webhookRoutes);

// ✅ Rutas normales
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/", (req, res) => {
  res.json({ message: "✅ API Maquicerros funcionando" });
});

export default router;
