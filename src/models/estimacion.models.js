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
        ORDER BY lib.Titulo ASC;   
    `);

    return rows;
}