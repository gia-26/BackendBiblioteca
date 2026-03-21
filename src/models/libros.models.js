import db from '../config/db.js';

export const getLibrosById = async (id) => {
    const [rows] = await db.query(`
        SELECT
            lib.Titulo,
            lib.Sinopsis,
            lib.Edicion,

            (SELECT aut.Nombre
                FROM tbl_autores aut
                WHERE aut.Id_autor = lib.Id_autor) AS Autor,

            (SELECT edit.Nombre
                FROM tbl_editoriales edit
                WHERE edit.Id_editorial = lib.Id_editorial) AS Editorial,

            (SELECT gen.Nombre
                FROM tbl_generos gen
                WHERE gen.Id_genero = lib.Id_genero) AS Genero,

            lib.ISBN,
            lib.Imagen,

            (SELECT anios.Anio_edicion
                FROM tbl_anios_edicion anios
                WHERE anios.Id_anio_edicion = lib.Id_anio_edicion) AS Anio

        FROM tbl_libros lib
        WHERE lib.Id_libro = ? AND lib.Estado != 0;
    `, [id]);
    return rows;
}

export const agregarLibro = async (libro) => {
    const { Id_libro, Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, Imagen} = libro;
    const [result] = await db.query(`
        INSERT INTO tbl_libros (Id_libro, Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, Estado, Imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [Id_libro, Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, 1, Imagen]);
    return result.insertId;
}

export const crearNuevoIdLibro = async () => {
    const [rows] = await db.query(`
        SELECT MAX(Id_libroAI) AS maxId FROM tbl_libros;
    `);
    const maxId = rows[0].maxId || 0;
    const nuevoId = maxId + 1;
    return `LIB${nuevoId.toString().padStart(3, '0')}`;
}

export const crearNuevoIdEjemplar = async () => {
    const [rows] = await db.query(`
        SELECT MAX(Id_ejemplarAI) AS maxId FROM tbl_ejemplares;
    `);
    const maxId = rows[0].maxId || 0;
    return maxId + 1;
}

export const agregarEjemplar = async (idLibro, idEjemplar, numEjemplar) => {
    await db.query(`
        INSERT INTO tbl_ejemplares (Id_ejemplar, Id_libro, Num_ejemplar, Id_estado_ejemplar)
        VALUES (?, ?, ?, ?);
    `, [idEjemplar, idLibro, numEjemplar, 'EE001']);
}

export const agregarSubgenero = async (idLibro, idGenero) => {
    await db.query(`
        INSERT INTO tbl_libros_generos (Id_genero, Id_libro)
        VALUES (?, ?);
    `, [idGenero, idLibro]);
}

export const agregarCoautor = async (idLibro, idAutor) => {
    await db.query(`
        INSERT INTO tbl_coautores (Id_autor, Id_libro)
        VALUES (?, ?);
    `, [idAutor, idLibro]);
}

export const agregarEditorialSecundaria = async (idLibro, idEditorial) => {
    await db.query(`
        INSERT INTO tbl_libros_editoriales (Id_editorial, Id_libro)
        VALUES (?, ?);
    `, [idEditorial, idLibro]);
}