import db from '../config/db.js';

// Obtener todos los roles
export const getAllRoles = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_roles ORDER BY Nombre ASC');
    return rows;
};

// Generar ID autoincremental (ROL001, ROL002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_rol FROM tbl_roles ORDER BY Id_rol DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_rol;
        const num = parseInt(ultimo.substring(3)) + 1;
        return 'ROL' + String(num).padStart(3, '0');
    }
    return 'ROL001';
};

// Agregar rol
export const createRol = async (nombre) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_roles (Id_rol, Nombre) VALUES (?, ?)',
        [nuevoId, nombre]
    );
    return { id: nuevoId };
};

// Editar rol
export const updateRol = async (id, nombre) => {
    await db.query(
        'UPDATE tbl_roles SET Nombre = ? WHERE Id_rol = ?',
        [nombre, id]
    );
    return { updated: true };
};

// Eliminar rol
export const deleteRol = async (id) => {
    await db.query('DELETE FROM tbl_roles WHERE Id_rol = ?', [id]);
    return { deleted: true };
};

// Verificar si el rol está asignado a algún usuario
export const rolEstaAsignado = async (id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total FROM tbl_usuarios WHERE Id_rol = ?',
        [id]
    );
    return rows[0].total > 0;
};