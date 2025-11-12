import { leerUsuarios, guardarUsuarios } from "../utils/fileDB.js";

export class UsuarioJSON {
  static async findAll() {
    return await leerUsuarios();
  }

  static async findByPk(id) {
    const usuarios = await leerUsuarios();
    return usuarios.find(u => u.id === id);
  }

  static async create(datos) {
    const usuarios = await leerUsuarios();
    const id = usuarios.length ? usuarios.at(-1).id + 1 : 1;
    const nuevo = {
      id,
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password,
      rol: datos.rol ?? "docente",
      fechaRegistro: new Date().toISOString(),
    };
    usuarios.push(nuevo);
    await guardarUsuarios(usuarios);
    return nuevo;
  }

  static async update(id, nuevosDatos) {
    const usuarios = await leerUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;
    usuarios[index] = { ...usuarios[index], ...nuevosDatos };
    await guardarUsuarios(usuarios);
    return usuarios[index];
  }

  static async destroy({ where: { id } }) {
    const usuarios = await leerUsuarios();
    const filtrados = usuarios.filter(u => u.id !== id);
    await guardarUsuarios(filtrados);
  }

  // Para mantener compatibilidad con Sequelize.sync()
  static async sync() {
    console.log("🟡 Base de datos JSON en uso. No se requiere sincronización SQL.");
  }
}
