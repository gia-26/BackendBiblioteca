import db from '../config/db.js';

// Obtener teléfono
export const getTelefono = async (idUsuario, sesion) => {
    let rows;
    if (sesion === 'Alumno') {
        [rows] = await db.query(`
            SELECT Telefono AS telefono
            FROM tbl_alumnos
            WHERE Id_alumno = ?
        `, [idUsuario]);
    } else if (sesion === 'Trabajador') {
        [rows] = await db.query(`
            SELECT Telefono AS telefono
            FROM tbl_trabajadores
            WHERE Id_trabajador = ?
        `, [idUsuario]);
    } else {
        // Personal (ROL001, ROL002, ROL003)
        [rows] = await db.query(`
            SELECT Telefono AS telefono
            FROM tbl_trabajadores
            WHERE Id_trabajador = (
                SELECT Id_trabajador FROM tbl_personal WHERE Id_personal = ?
            )
        `, [idUsuario]);
    }
    return rows[0] || null;
};

// Actualizar teléfono
export const updateTelefono = async (idUsuario, sesion, telefono) => {
    let result;
    if (sesion === 'Alumno') {
        [result] = await db.query(`
            UPDATE tbl_alumnos SET Telefono = ? WHERE Id_alumno = ?
        `, [telefono, idUsuario]);
    } else if (sesion === 'Trabajador') {
        [result] = await db.query(`
            UPDATE tbl_trabajadores SET Telefono = ? WHERE Id_trabajador = ?
        `, [telefono, idUsuario]);
    } else {
        // Personal (ROL001, ROL002, ROL003)
        [result] = await db.query(`
            UPDATE tbl_trabajadores SET Telefono = ?
            WHERE Id_trabajador = (
                SELECT Id_trabajador FROM tbl_personal WHERE Id_personal = ?
            )
        `, [telefono, idUsuario]);
    }
    return result.affectedRows > 0;
};

// Obtener password hash
export const getPasswordHash = async (idUsuario, sesion) => {
    let rows;
    if (sesion === 'Alumno' || sesion === 'Trabajador') {
        [rows] = await db.query(`
            SELECT Password AS password_hash
            FROM tbl_usuarios
            WHERE Id_usuario = ?
        `, [idUsuario]);
    } else {
        // Personal (ROL001, ROL002, ROL003)
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
    if (sesion === 'Alumno' || sesion === 'Trabajador') {
        [result] = await db.query(`
            UPDATE tbl_usuarios SET Password = ? WHERE Id_usuario = ?
        `, [nuevoHash, idUsuario]);
    } else {
        // Personal (ROL001, ROL002, ROL003)
        [result] = await db.query(`
            UPDATE tbl_personal SET Password = ? WHERE Id_personal = ?
        `, [nuevoHash, idUsuario]);
    }
    return result.affectedRows > 0;
};