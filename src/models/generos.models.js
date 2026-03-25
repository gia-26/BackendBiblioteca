import db from '../config/db.js';

// Obtener todos los géneros
export const getAllGeneros = async () => {

    const [rows] = await db.query('SELECT * FROM tbl_generos ORDER BY Nombre ASC');
    return rows;
};

// Generar ID autoincremental (GEN001, GEN002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_genero FROM tbl_generos ORDER BY Id_genero DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_genero;
        const num = parseInt(ultimo.substring(3)) + 1;
        return 'GEN' + String(num).padStart(3, '0');
    }
    return 'GEN001';
};

// Agregar género
export const createGenero = async (nombre) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_generos (Id_genero, Nombre) VALUES (?, ?)',
        [nuevoId, nombre]
    );
    return { id: nuevoId };
};

// Editar género
export const updateGenero = async (id, nombre) => {
    await db.query(
        'UPDATE tbl_generos SET Nombre = ? WHERE Id_genero = ?',
        [nombre, id]
    );
    return { updated: true };
};

// Eliminar género
export const deleteGenero = async (id) => {
    await db.query('DELETE FROM tbl_generos WHERE Id_genero = ?', [id]);
    return { deleted: true };
};