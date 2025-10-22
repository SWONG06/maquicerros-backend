import { Router } from "express";
import { sendMail } from "../config/mail.js";

const router = Router();

router.get("/send-test-email", async (req, res) => {
  try {
    await sendMail(
      req.query.to || "stephanowong04@gmail.com", // cambiar luego si quieres
      "📩 Prueba de correo desde Maquicerros",
      "<h2>✅ Todo correcto</h2><p>El sistema de correo funciona perfecto 🔥</p>"
    );

    res.json({ message: "✅ Correo enviado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error enviando correo", error: error.message });
  }
});

export default router;
