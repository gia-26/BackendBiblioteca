import db from '../config/db.js';

// Obtener todos los años
export const getAllAnios = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_anios_edicion ORDER BY Anio_edicion DESC');
    return rows;
};

// Generar ID autoincremental (AE001, AE002...)
const generarNuevoId = async () => {
    const [rows] = await db.query('SELECT Id_anio_edicion FROM tbl_anios_edicion ORDER BY Id_anio_edicion DESC LIMIT 1');
    if (rows.length > 0) {
        const ultimo = rows[0].Id_anio_edicion;
        const num = parseInt(ultimo.substring(2)) + 1;
        return 'AE' + String(num).padStart(3, '0');
    }
    return 'AE001';
};

// Agregar año
export const createAnio = async (anioEdicion) => {
    const nuevoId = await generarNuevoId();
    await db.query('INSERT INTO tbl_anios_edicion (Id_anio_edicion, Anio_edicion) VALUES (?, ?)', [nuevoId, anioEdicion]);
    return { id: nuevoId };
};

// Editar año
export const updateAnio = async (id, anioEdicion) => {
    await db.query('UPDATE tbl_anios_edicion SET Anio_edicion = ? WHERE Id_anio_edicion = ?', [anioEdicion, id]);
    return { updated: true };
};

// Eliminar año
export const deleteAnio = async (id) => {
    await db.query('DELETE FROM tbl_anios_edicion WHERE Id_anio_edicion = ?', [id]);
    return { deleted: true };
};