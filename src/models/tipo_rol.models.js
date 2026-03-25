import db from '../config/db.js';

export const getAllRoles = async () => {
    try {
        // Ajusta los nombres de las columnas según tu tabla
        const [rows] = await db.query('SELECT Id_rol, Nombre FROM tbl_roles ORDER BY Nombre ASC');
        return rows;
    } catch (error) {
        console.error('Error en getAllRoles:', error);
        throw error;
    }
};

const generarNuevoId = async () => {
    try {
        const [rows] = await db.query(
            'SELECT Id_rol FROM tbl_roles ORDER BY Id_rol DESC LIMIT 1'
        );
        if (rows.length > 0) {
            const ultimo = rows[0].Id_rol;
            const num = parseInt(ultimo.substring(3)) + 1;
            return 'ROL' + String(num).padStart(3, '0');
        }
        return 'ROL001';
    } catch (error) {
        console.error('Error en generarNuevoId:', error);
        return 'ROL001';
    }
};

export const createRol = async (nombre) => {
    try {
        const nuevoId = await generarNuevoId();
        await db.query(
            'INSERT INTO tbl_roles (Id_rol, Nombre) VALUES (?, ?)',
            [nuevoId, nombre]
        );
        return { id: nuevoId };
    } catch (error) {
        console.error('Error en createRol:', error);
        throw error;
    }
};

export const updateRol = async (id, nombre) => {
    try {
        await db.query(
            'UPDATE tbl_roles SET Nombre = ? WHERE Id_rol = ?',
            [nombre, id]
        );
        return { updated: true };
    } catch (error) {
        console.error('Error en updateRol:', error);
        throw error;
    }
};

export const deleteRol = async (id) => {
    try {
        await db.query('DELETE FROM tbl_roles WHERE Id_rol = ?', [id]);
        return { deleted: true };
    } catch (error) {
        console.error('Error en deleteRol:', error);
        throw error;
    }
};

export const rolEstaAsignado = async (id) => {
    try {
        // Verificar en qué tabla se usa el Id_rol
        // Puede ser en tbl_usuarios, tbl_trabajadores, o tbl_personal
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM tbl_usuarios WHERE Id_rol = ?',
            [id]
        );
        return rows[0].total > 0;
    } catch (error) {
        console.error('Error en rolEstaAsignado:', error);
        return false;
    }
};