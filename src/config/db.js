import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// 🧩 Crear instancia de Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para Render / Aiven
      },
    },
  }
);

// 🟢 Conexión con MySQL
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado exitosamente a MySQL con Sequelize");
  } catch (error) {
    console.error("❌ Error de conexión a MySQL:", error.message);
    process.exit(1);
  }
};
