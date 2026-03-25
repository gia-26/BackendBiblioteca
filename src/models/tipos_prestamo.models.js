import db from '../config/db.js';

export const getAllTiposPrestamo = async () => {
    const [rows] = await db.query(
        'SELECT * FROM tbl_tipos_prestamos ORDER BY Tipo_prestamo ASC'
    );
    return rows;
};

const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_tipo_prestamo FROM tbl_tipos_prestamos ORDER BY Id_tipo_prestamo DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_tipo_prestamo;
        const num = parseInt(ultimo.substring(2)) + 1;
        return 'TP' + String(num).padStart(3, '0');
    }
    return 'TP001';
};

export const createTipoPrestamo = async (tipoPrestamo) => { 
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_tipos_prestamos (Id_tipo_prestamo, Tipo_prestamo) VALUES (?, ?)',
        [nuevoId, tipoPrestamo]  
    );
    return { id: nuevoId };
};

export const updateTipoPrestamo = async (id, tipoPrestamo) => { 
    await db.query(
        'UPDATE tbl_tipos_prestamos SET Tipo_prestamo = ? WHERE Id_tipo_prestamo = ?',
        [tipoPrestamo, id] 
    );
    return { updated: true };
};

export const deleteTipoPrestamo = async (id) => {
    await db.query(
        'DELETE FROM tbl_tipos_prestamos WHERE Id_tipo_prestamo = ?',
        [id]
    );
    return { deleted: true };
};