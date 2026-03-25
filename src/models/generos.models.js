import db from '../config/db.js';

// OBTENER GENEROS
export const getAllGeneros = async () => {
    const [rows] = await db.query(`
        SELECT Id_genero, Nombre
        FROM tbl_generos
        ORDER BY Nombre
    `);
    return rows;
};

// AGREGAR GENERO
export const agregarGenero = async ({ Nombre }) => {
    await db.query(`
        INSERT INTO tbl_generos (Nombre) VALUES (?)
    `, [Nombre]);
};

// EDITAR GENERO
export const editarGenero = async ({ Id_genero, Nombre }) => {
    await db.query(`
        UPDATE tbl_generos SET Nombre = ? WHERE Id_genero = ?
    `, [Nombre, Id_genero]);
};

// ELIMINAR GENERO
export const eliminarGenero = async ({ Id_genero }) => {
    await db.query(`
        DELETE FROM tbl_generos WHERE Id_genero = ?
    `, [Id_genero]);
};

// ✅ VERIFICAR SI EL GÉNERO ESTÁ ASIGNADO A ALGÚN LIBRO
export const generoEstaAsignado = async (id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total FROM tbl_libros WHERE Id_genero = ?',
        [id]
    );
    return rows[0].total > 0;
};