import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import db from "../models/index.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await db.User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    return res.status(500).json({ message: "Error en registro", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Correo no registrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.json({ message: "Login exitoso", token, user });
  } catch (error) {
    return res.status(500).json({ message: "Error en login", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "createdAt"]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};
