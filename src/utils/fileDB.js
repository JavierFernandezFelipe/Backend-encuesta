import fs from "fs/promises";
const RUTA = "./src/data/usuarios.json";

export async function leerUsuarios() {
  try {
    const data = await fs.readFile(RUTA, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(RUTA, "[]");
      return [];
    }
    console.error("❌ Error leyendo usuarios.json:", err.message);
    return [];
  }
}

export async function guardarUsuarios(usuarios) {
  try {
    await fs.writeFile(RUTA, JSON.stringify(usuarios, null, 2));
  } catch (err) {
    console.error("❌ Error guardando usuarios.json:", err.message);
  }
}
