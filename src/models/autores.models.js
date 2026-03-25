import db from '../config/db.js';

export const getAllAutores = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_autores ORDER BY Nombre ASC');
    return rows;
};