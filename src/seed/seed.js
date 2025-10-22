import bcrypt from "bcrypt";
import db from "../models/index.js";

export const runSeed = async () => {
  try {
    // --- Crear Admin ---
    const adminEmail = "admin@maquicerros.com";

    const existingAdmin = await db.User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await db.User.create({
        name: "Administrador",
        email: adminEmail,
        password: await bcrypt.hash("Admin123*", 10),
        role: "admin",
      });
      console.log("✅ Usuario admin creado");
    } else {
      console.log("ℹ️ El admin ya existe, se omitió creación");
    }

    // --- Crear categorías iniciales ---
    const initialCategories = [
      "Electricidad",
      "Construcción",
      "Pintura",
      "Herramientas Eléctricas",
      "Seguridad Industrial",
      "Materiales de Obra",
      "Cerrajería",
      "Automotriz",
      "Soldadura",
    ];

    for (const name of initialCategories) {
      const exists = await db.Category.findOne({ where: { name } });
      if (!exists) {
        await db.Category.create({ name, status: "ACTIVE" });
        console.log(`✅ Categoría creada: ${name}`);
      }
    }

    console.log("✅ Seed completado");
  } catch (error) {
    console.error("❌ Error ejecutando seed:", error.message);
  }
};
