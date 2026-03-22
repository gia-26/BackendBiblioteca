import db from '../config/db.js';

export const getLibrosById = async (id) => {
    const [rows] = await db.query(`
        SELECT
            lib.Titulo,
            lib.Sinopsis,
            lib.Edicion,
            lib.Id_autor,
            lib.Id_editorial,
            lib.Id_genero,
            lib.ISBN,
            lib.Imagen,
            lib.Id_anio_edicion,
            lib.Id_area_conocimiento
        FROM tbl_libros lib
        WHERE lib.Id_libro = ? AND lib.Estado != 0;
    `, [id]);
    return rows;
}

export const getSubgenerosByLibroId = async (idLibro) => {
    const [rows] = await db.query(`
        SELECT g.Id_genero, g.Nombre
        FROM tbl_libros_generos	libGen
        INNER JOIN tbl_generos g ON libGen.Id_genero = g.Id_genero
        WHERE libGen.Id_libro = ?;
    `, [idLibro]);
    return rows;
}

export const getCouautoresByLibroId = async (idLibro) => {
    const [rows] = await db.query(`
        SELECT a.Id_autor, a.Nombre
        FROM tbl_coautores coaut
        INNER JOIN tbl_autores a ON coaut.Id_autor = a.Id_autor
        WHERE coaut.Id_libro = ?;
    `, [idLibro]);
    return rows;
}

export const getEditorialesSecundariasByLibroId = async (idLibro) => {
    const [rows] = await db.query(`
        SELECT e.Id_editorial, e.Nombre
        FROM tbl_libros_editoriales libEdit
        INNER JOIN tbl_editoriales e ON libEdit.Id_editorial = e.Id_editorial
        WHERE libEdit.Id_libro = ?;
    `, [idLibro]);
    return rows;
}

export const getEjemplaresByLibroId = async (idLibro) => {
    const [rows] = await db.query(`
        SELECT Id_ejemplar
        FROM tbl_ejemplares
        WHERE Id_libro = ?;
    `, [idLibro]);
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

export const editarLibro = async (libro) => {
    const { Id_libro, Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, Imagen} = libro;
    const [result] = await db.query(`
        UPDATE tbl_libros
        SET Titulo = ?, Sinopsis = ?, Edicion = ?, Id_editorial = ?, Id_autor = ?, Id_genero = ?, Id_anio_edicion = ?, ISBN = ?, Id_area_conocimiento = ?, Imagen = ?
        WHERE Id_libro = ?;
    `, [Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, Imagen, Id_libro]);
    return result.affectedRows > 0;
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

export const eliminarSubgeneros = async (idLibro) => {
    await db.query(`
        DELETE FROM tbl_libros_generos
        WHERE Id_libro = ?;
    `, [idLibro]);
}

export const eliminarCoautores = async (idLibro) => {
    await db.query(`
        DELETE FROM tbl_coautores
        WHERE Id_libro = ?;
    `, [idLibro]);
}

export const eliminarEditorialesSecundarias = async (idLibro) => {
    await db.query(`
        DELETE FROM tbl_libros_editoriales
        WHERE Id_libro = ?;
    `, [idLibro]);
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