import db from '../config/db.js';

// Obtener todas las editoriales
export const getAllEditoriales = async () => {
    const [rows] = await db.query(
        'SELECT * FROM tbl_editoriales ORDER BY Nombre ASC'
    );
    return rows;
};

// Generar ID autoincremental (EDI001, EDI002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_editorial FROM tbl_editoriales ORDER BY Id_editorial DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_editorial;
        const num = parseInt(ultimo.substring(3)) + 1;
        return 'EDI' + String(num).padStart(3, '0');
    }
    return 'EDI001';
};

// Agregar editorial
export const createEditorial = async (nombre, pais) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_editoriales (Id_editorial, Nombre, Pais) VALUES (?, ?, ?)',
        [nuevoId, nombre, pais]
    );
    return { id: nuevoId };
};

// Editar editorial
export const updateEditorial = async (id, nombre, pais) => {
    await db.query(
        'UPDATE tbl_editoriales SET Nombre = ?, Pais = ? WHERE Id_editorial = ?',
        [nombre, pais, id]
    );
    return { updated: true };
};

// Eliminar editorial
export const deleteEditorial = async (id) => {
    await db.query(
        'DELETE FROM tbl_editoriales WHERE Id_editorial = ?',
        [id]
    );
    return { deleted: true };
};