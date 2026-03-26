import db from '../config/db.js';

export const getAllRoles = async () => {
    const [rows] = await db.query(
        'SELECT Id_rol, Tipo_rol FROM tbl_roles ORDER BY Tipo_rol ASC'
    );
    return rows;
};

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

export const createRol = async (tipoRol) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_roles (Id_rol, Tipo_rol) VALUES (?, ?)',
        [nuevoId, tipoRol]
    );
    return { id: nuevoId };
};

export const updateRol = async (id, tipoRol) => {
    await db.query(
        'UPDATE tbl_roles SET Tipo_rol = ? WHERE Id_rol = ?',
        [tipoRol, id]
    );
    return { updated: true };
};

export const deleteRol = async (id) => {
    await db.query(
        'DELETE FROM tbl_roles WHERE Id_rol = ?',
        [id]
    );
    return { deleted: true };
};

// Id_rol
export const rolEstaAsignado = async (id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total FROM tbl_personal WHERE Id_rol = ?',
        [id]
    );
    return rows[0].total > 0;
};