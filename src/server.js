import express from "express";
import dotenv from "dotenv";
import { conectarBD, sequelize } from "./config/db.js";
import { Usuario } from "./models/Usuario.js";
import { hacerBackup } from "./utils/backup.js";

dotenv.config();

const app = express();
app.use(express.json());

// 🌐 Ruta de inicio
app.get("/", (req, res) => {
  res.send("🚀 API del Sistema de Encuestas funcionando correctamente");
});

// 💾 Generar backup manual (por si quieres hacerlo a mano)
app.get("/backup", async (req, res) => {
  try {
    await hacerBackup();
    res.send("🗄️ Backup de la base de datos generado correctamente");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al realizar el backup", details: error.message });
  }
});

// 👤 Crear un nuevo usuario + backup automático
app.post("/usuarios", async (req, res) => {
  try {
    // Crear usuario en la base de datos
    const nuevoUsuario = await Usuario.create(req.body);

    // Generar automáticamente una copia de seguridad
    await hacerBackup();
    console.log("🗂️ Backup generado tras crear usuario.");

    res.status(201).json({
      message: "Usuario creado y backup generado correctamente.",
      usuario: nuevoUsuario,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Listar todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await conectarBD();
    await sequelize.sync({ alter: true });

    // Backup inicial al arrancar el servidor
    await hacerBackup();
    console.log("🗄️ Backup inicial generado.");

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
})();
