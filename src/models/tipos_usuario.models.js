import db from '../config/db.js';

export const getAllTipos = async () => {
    const [rows] = await db.query(
        'SELECT * FROM tbl_tipos_usuario ORDER BY Tipo_usuario ASC'
    );
    return rows;
};

const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_tipo_usuario FROM tbl_tipos_usuario ORDER BY Id_tipo_usuario DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_tipo_usuario;
        const num = parseInt(ultimo.substring(2)) + 1;
        return 'TU' + String(num).padStart(3, '0');
    }
    return 'TU001';
};

export const createTipo = async (tipoUsuario) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_tipos_usuario (Id_tipo_usuario, Tipo_usuario) VALUES (?, ?)',
        [nuevoId, tipoUsuario]
    );
    return { id: nuevoId };
};

export const updateTipo = async (id, tipoUsuario) => {
    await db.query(
        'UPDATE tbl_tipos_usuario SET Tipo_usuario = ? WHERE Id_tipo_usuario = ?',
        [tipoUsuario, id]
    );
    return { updated: true };
};

export const deleteTipo = async (id) => {
    await db.query(
        'DELETE FROM tbl_tipos_usuario WHERE Id_tipo_usuario = ?',
        [id]
    );
    return { deleted: true };
};