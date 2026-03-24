import db from '../config/db.js';

export const getAllLibrosEstimaciones = async () => {
    const [rows] = await db.query(`
        SELECT 
            lib.Id_libro,
            lib.Titulo,
            COUNT(p.Id_prestamo) AS prestamos_totales,
            lib.Imagen
        FROM tbl_libros lib
        INNER JOIN tbl_ejemplares ej 
        ON lib.Id_libro = ej.Id_libro
        INNER JOIN tbl_prestamos p 
        ON ej.Id_ejemplar = p.Id_ejemplar
        WHERE p.Fecha_prestamo > '2026-01-01'
        GROUP BY lib.Id_libro, lib.Titulo
        ORDER BY COUNT(p.Id_prestamo) DESC;    
    `);
    return rows;
}

export const getDia1 = async (idLibro, fecha) => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) AS prestamos_dia_1
        FROM tbl_prestamos p
        INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
        INNER JOIN tbl_libros lib ON lib.Id_libro = e.Id_libro
        WHERE e.Id_libro = ?
        AND p.Fecha_prestamo = ?;
    `, [idLibro, fecha]);

    return rows[0];
}

export const getDia4 = async (idLibro, fecha) => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) AS prestamos_dia_4
        FROM tbl_prestamos p
        INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
        INNER JOIN tbl_libros lib ON lib.Id_libro = e.Id_libro
        WHERE e.Id_libro = ?
        AND p.Fecha_prestamo = ?;
    `, [idLibro, fecha]);

    return rows[0];
}