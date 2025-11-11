import mysqldump from "mysqldump";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const hacerBackup = async () => {
  const fecha = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve("backups");
  const backupFile = path.join(backupDir, `backup_${fecha}.sql`);

  // Crear carpeta si no existe
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
      dumpToFile: backupFile,
    });
    console.log(`✅ Backup realizado correctamente: ${backupFile}`);
  } catch (err) {
    console.error("❌ Error al generar el backup:", err);
  }
};
