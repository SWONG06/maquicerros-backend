import crypto from "crypto";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import { sendMail } from "../config/mail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "No existe un usuario con ese correo" });

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await db.PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt
    });

    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

    await sendMail(
      user.email,
      "🔐 Recupera tu contraseña - Maquicerros",
      `<h3>Hola ${user.name}</h3>
      <p>Haz clic en el enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>El enlace caduca en 15 minutos.</p>`
    );

    return res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    return res.status(500).json({ message: "Error enviando correo", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const record = await db.PasswordResetToken.findOne({ where: { token } });
    if (!record)
      return res.status(400).json({ message: "Token inválido" });

    if (record.used)
      return res.status(400).json({ message: "Token ya utilizado" });

    if (new Date(record.expiresAt) < new Date())
      return res.status(400).json({ message: "Token expirado" });

    const user = await db.User.findByPk(record.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const hashed = await bcrypt.hash(password, 10);
    await user.update({ password: hashed });
    await record.update({ used: true });

    return res.json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al restablecer contraseña", error: error.message });
  }
};
