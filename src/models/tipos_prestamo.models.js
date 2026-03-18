import db from '../config/db.js';

// Obtener todos los tipos de préstamo
export const getAllTiposPrestamo = async () => {
    const [rows] = await db.query(
        'SELECT * FROM tbl_tipos_prestamo ORDER BY Nombre ASC'
    );
    return rows;
};

// Generar ID (TP001, TP002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_tipo_prestamo FROM tbl_tipos_prestamo ORDER BY Id_tipo_prestamo DESC LIMIT 1'
    );

    if (rows.length > 0) {
        const ultimo = rows[0].Id_tipo_prestamo;
        const num = parseInt(ultimo.substring(2)) + 1;
        return 'TP' + String(num).padStart(3, '0');
    }

    return 'TP001';
};

// Agregar tipo de préstamo
export const createTipoPrestamo = async (nombre) => {
    const nuevoId = await generarNuevoId();

    await db.query(
        'INSERT INTO tbl_tipos_prestamo (Id_tipo_prestamo, Nombre) VALUES (?, ?)',
        [nuevoId, nombre]
    );

    return { id: nuevoId };
};

// Editar tipo de préstamo
export const updateTipoPrestamo = async (id, nombre) => {
    await db.query(
        'UPDATE tbl_tipos_prestamo SET Nombre = ? WHERE Id_tipo_prestamo = ?',
        [nombre, id]
    );

    return { updated: true };
};

// Eliminar tipo de préstamo
export const deleteTipoPrestamo = async (id) => {
    await db.query(
        'DELETE FROM tbl_tipos_prestamo WHERE Id_tipo_prestamo = ?',
        [id]
    );

    return { deleted: true };
};