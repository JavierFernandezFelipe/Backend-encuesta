import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // para que no spamee la consola
  }
);

export const conectarBD = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos MySQL");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
};
