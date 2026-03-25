import db from '../config/db.js';

export const getCatalogo = async (limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(ej.Id_ejemplar) AS Ejemplares_Disponibles
        FROM tbl_libros lib
        INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
        LEFT JOIN tbl_ejemplares ej ON lib.Id_libro = ej.Id_libro 
            AND ej.Id_estado_ejemplar != 'EE002'
        WHERE lib.Estado != 0
        GROUP BY lib.Id_libro
        LIMIT ? OFFSET ?;  
    `, [limit, skip]);
    return rows;
}

export const getCatalogoByTitulo = async (titulo, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(ejem.Id_ejemplar) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            LEFT JOIN tbl_ejemplares ejem ON lib.Id_libro = ejem.Id_libro 
            AND ejem.Id_estado_ejemplar != 'EE002'
            WHERE lib.Estado != 0 AND lib.Titulo LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${titulo}%`, limit, skip]);
    return [rows, rows.length ||0];
}

export const getCatalogoByGenero = async (genero, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(ejem.Id_ejemplar) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            LEFT JOIN tbl_ejemplares ejem ON lib.Id_libro = ejem.Id_libro 
            AND ejem.Id_estado_ejemplar != 'EE002'
            INNER JOIN tbl_generos gen ON lib.Id_genero = gen.Id_genero 
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado' AND gen.Nombre LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${genero}%`, limit, skip]);
    return [rows, rows.length || 0];
}

export const getCatalogoAutor = async (autor, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(ejem.Id_ejemplar) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            LEFT JOIN tbl_ejemplares ejem ON lib.Id_libro = ejem.Id_libro 
            AND ejem.Id_estado_ejemplar != 'EE002'
            WHERE lib.Estado != 0 AND aut.Nombre LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${autor}%`, limit, skip]);
    return [rows, rows.length || 0];
}

export const getTotalLibros = async () => {
    const [rows] = await db.query(`
        SELECT COUNT(DISTINCT lib.Id_libro) as total
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            LEFT JOIN tbl_ejemplares ejem ON lib.Id_libro = ejem.Id_libro 
            AND ejem.Id_estado_ejemplar != 'EE002'
            WHERE lib.Estado != 0 AND ejem.Id_ejemplar IS NOT NULL;
    `);
    return rows[0].total;
}

export const getCatalogoByIA = async (filtros = {}) => {
    const { 
        genero = null, 
        autor = null, 
        titulo = null, 
        anio = null,
        limit = 5,
        offset = 0
    } = filtros;
    
    const [rows] = await db.query(`
        SELECT 
            lib.Id_libro, 
            lib.Titulo, 
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 
                THEN CONCAT(LEFT(lib.Sinopsis, 100), '...') 
                ELSE lib.Sinopsis 
            END AS Sinopsis, 
            lib.Imagen, 
            COUNT(DISTINCT ejem.Id_ejemplar) AS Ejemplares_Disponibles 
        FROM tbl_libros lib 
        INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor 
        INNER JOIN tbl_generos gen ON lib.Id_genero = gen.Id_genero 
        INNER JOIN tbl_anios_edicion ae ON lib.Id_anio_edicion = ae.Id_anio_edicion 
        LEFT JOIN tbl_ejemplares ejem ON lib.Id_libro = ejem.Id_libro 
            AND ejem.Id_estado_ejemplar IN (
                SELECT Id_estado_ejemplar 
                FROM tbl_estado_ejemplar 
                WHERE Estado_ejemplar != 'Prestado'
            )
        WHERE lib.Estado != 0
            AND (? IS NULL OR gen.Nombre LIKE ?)
            AND (? IS NULL OR aut.Nombre LIKE ?)
            AND (? IS NULL OR lib.Titulo LIKE ?)
            AND (? IS NULL OR ae.Anio_edicion = ?)
        GROUP BY lib.Id_libro, lib.Titulo, aut.Nombre, gen.Nombre, lib.Sinopsis, lib.Imagen
        LIMIT ? OFFSET ?
    `, 
    [
        genero, `%${genero}%`,
        autor, `%${autor}%`,
        titulo, `%${titulo}%`,
        anio, anio,
        parseInt(limit), 
        parseInt(offset)
    ]
    );
    return rows;
}