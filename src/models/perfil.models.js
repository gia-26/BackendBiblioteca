import db from '../config/db.js';

// Obtener teléfono del usuario
export const getTelefono = async (idUsuario) => {
    const [rows] = await db.query(`
        SELECT Telefono AS telefono
        FROM tbl_usuarios
        WHERE Id_usuario = ?
    `, [idUsuario]);
    return rows[0] || null;
};

// Actualizar teléfono
export const updateTelefono = async (idUsuario, telefono) => {
    const [result] = await db.query(`
        UPDATE tbl_usuarios
        SET Telefono = ?
        WHERE Id_usuario = ?
    `, [telefono, idUsuario]);
    return result.affectedRows > 0;
};

// Obtener password hash para verificar
export const getPasswordHash = async (idUsuario, sesion) => {
    let rows;
    if (sesion === 'Miembro') {
        [rows] = await db.query(`
            SELECT Password AS password_hash
            FROM tbl_usuarios
            WHERE Id_usuario = ?
        `, [idUsuario]);
    } else {
        [rows] = await db.query(`
            SELECT Password AS password_hash
            FROM tbl_personal
            WHERE Id_personal = ?
        `, [idUsuario]);
    }
    return rows[0] || null;
};

// Actualizar contraseña
export const updatePassword = async (idUsuario, sesion, nuevoHash) => {
    let result;
    if (sesion === 'Miembro') {
        [result] = await db.query(`
            UPDATE tbl_usuarios SET Password = ? WHERE Id_usuario = ?
        `, [nuevoHash, idUsuario]);
    } else {
        [result] = await db.query(`
            UPDATE tbl_personal SET Password = ? WHERE Id_personal = ?
        `, [nuevoHash, idUsuario]);
    }
    return result.affectedRows > 0;
};