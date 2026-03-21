import * as librosModel from '../models/libros.models.js';

export const getLibrosById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID requerido" });
        }

        const libroBase = await librosModel.getLibrosById(id);

        if (!libroBase) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        //Agregar subgeneros, coautores, editoriales secundarias y ejemplares al objeto libro
        libroBase.subgeneros = await librosModel.getSubgenerosByLibroId(id);
        libroBase.coautores = await librosModel.getCouautoresByLibroId(id);
        libroBase.editorialesSecundarias = await librosModel.getEditorialesSecundariasByLibroId(id);
        libroBase.ejemplares = await librosModel.getEjemplaresByLibroId(id);
        
        res.status(200).json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const agregarLibro = async (req, res) => {
    try {
        const nuevoId = await librosModel.crearNuevoIdLibro();
        const titulo = req.body.titulo;
        const isbn = req.body.isbn;
        const edicion = req.body.edicion;
        const anioEdicion = req.body.anioEdicion;
        const areaConocimiento = req.body.areaConocimiento;
        const generoPrincipal = req.body.generoPrincipal;
        const subgeneros = Array.from(req.body.subgeneros) || [];
        const autorPrincipal = req.body.autorPrincipal;
        const coautores = Array.from(req.body.coautores) || [];
        const editorialPrincipal = req.body.editorialPrincipal;
        const editorialesSecundarias = Array.from(req.body.editorialesSecundarias) || [];
        const sinopsis = req.body.sinopsis;
        const noEjemplares = req.body.noEjemplares;
        const urlImagen = req.body.urlImagen;

        if (!titulo || !isbn || !edicion || !anioEdicion || !areaConocimiento || !generoPrincipal || !autorPrincipal || !editorialPrincipal || !sinopsis || !noEjemplares || !urlImagen) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        const id = await librosModel.agregarLibro({
            Id_libro: nuevoId,
            Titulo: titulo,
            Sinopsis: sinopsis,
            Edicion: edicion,
            Id_editorial: editorialPrincipal,
            Id_autor: autorPrincipal,
            Id_genero: generoPrincipal,
            Id_anio_edicion: anioEdicion,
            ISBN: isbn,
            Id_area_conocimiento: areaConocimiento,
            Imagen: urlImagen
        });

        if (!id) return res.status(500).json({ error: 'Error al agregar el libro' }); 
        
        if (subgeneros) await agregarSubgeneros(subgeneros, nuevoId);
        if (coautores) await agregarCoautores(coautores, nuevoId);
        if (editorialesSecundarias) await agregarEditorialesSecundarias(editorialesSecundarias, nuevoId);
        if (noEjemplares) await agregarEjemplares(noEjemplares, nuevoId);
        
        res.status(201).json({ success: true, message: 'Libro agregado exitosamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const agregarSubgeneros = async (subgeneros, nuevoId) => {
    for (const idGenero of subgeneros) {
        await librosModel.agregarSubgenero(nuevoId, idGenero);
    }
}

const agregarCoautores = async (coautores, nuevoId) => {
    for (const idAutor of coautores) {
        await librosModel.agregarCoautor(nuevoId, idAutor);
    }
}

const agregarEditorialesSecundarias = async (editorialesSecundarias, nuevoId) => {
    for (const idEditorial of editorialesSecundarias) {
        await librosModel.agregarEditorialSecundaria(nuevoId, idEditorial);
    }
}

const agregarEjemplares = async (noEjemplares, nuevoIdLibro) => {
    let nuevoIdEjemplar = await librosModel.crearNuevoIdEjemplar();
    for (let i = 1; i <= noEjemplares; i++) {
        await librosModel.agregarEjemplar(nuevoIdLibro, `EJE${nuevoIdEjemplar.toString().padStart(3, '0')}`, i);
        nuevoIdEjemplar++;
    }
} 