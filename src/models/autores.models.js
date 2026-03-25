import db from '../config/db.js';

// Obtener todos los autores
export const getAllAutores = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_autores ORDER BY Nombre ASC');
    return rows;
};

// Generar ID autoincremental (AUT001, AUT002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_autor FROM tbl_autores ORDER BY Id_autor DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_autor;
        const num = parseInt(ultimo.substring(3)) + 1;
        return 'AUT' + String(num).padStart(3, '0');
    }
    return 'AUT001';
};

// Agregar autor
export const createAutor = async (nombre) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_autores (Id_autor, Nombre) VALUES (?, ?)',
        [nuevoId, nombre]
    );
    return { id: nuevoId };
};

// Editar autor
export const updateAutor = async (id, nombre) => {
    await db.query(
        'UPDATE tbl_autores SET Nombre = ? WHERE Id_autor = ?',
        [nombre, id]
    );
    return { updated: true };
};

// Eliminar autor
export const deleteAutor = async (id) => {
    await db.query('DELETE FROM tbl_autores WHERE Id_autor = ?', [id]);
    return { deleted: true };
};

// Verificar si el autor está asignado a algún libro
export const autorEstaAsignado = async (id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total FROM tbl_libros WHERE Id_autor = ?',
        [id]
    );
    return rows[0].total > 0;
};