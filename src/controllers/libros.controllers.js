import * as librosModel from '../models/libros.models.js';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

dotenv.config();

export const getLibrosById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, error: "ID requerido" });
        }

        const libroBase = await librosModel.getLibrosById(id);

        if (!libroBase) {
            return res.status(404).json({ success: false, error: "Libro no encontrado" });
        }

        const libro = {
            ...libroBase[0],
            subgeneros: await librosModel.getSubgenerosByLibroId(id),
            coautores: await librosModel.getCouautoresByLibroId(id),
            editorialesSecundarias: await librosModel.getEditorialesSecundariasByLibroId(id),
            ejemplares: await librosModel.getEjemplaresByLibroId(id)
        }

        res.status(200).json({ success: true, data: libro });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
            return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
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

        if (!id) return res.status(500).json({ success: false, error: 'Error al agregar el libro' }); 
        
        if (subgeneros) await agregarSubgeneros(subgeneros, nuevoId);
        if (coautores) await agregarCoautores(coautores, nuevoId);
        if (editorialesSecundarias) await agregarEditorialesSecundarias(editorialesSecundarias, nuevoId);
        if (noEjemplares) await agregarEjemplares(noEjemplares, nuevoId);
        
        res.status(201).json({ success: true, message: 'Libro agregado exitosamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
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

export const editarLibro = async (req, res) => {
    try {
        const idLibro = req.body.idLibro;
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
        const urlImagen = req.body.url;

        if (!idLibro || !titulo || !isbn || !edicion || !anioEdicion || !areaConocimiento || !generoPrincipal || !autorPrincipal || !editorialPrincipal || !sinopsis || !urlImagen) {
            return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
        }

        const libroEditado = await librosModel.editarLibro({
            Id_libro: idLibro,
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

        if (!libroEditado) return res.status(500).json({ success: false, error: 'Error al editar el libro' });

        await librosModel.eliminarSubgeneros(idLibro);
        await librosModel.eliminarCoautores(idLibro);
        await librosModel.eliminarEditorialesSecundarias(idLibro);


        if (subgeneros) await agregarSubgeneros(subgeneros, idLibro);
        if (coautores) await agregarCoautores(coautores, idLibro);
        if (editorialesSecundarias) await agregarEditorialesSecundarias(editorialesSecundarias, idLibro);
        if (noEjemplares || noEjemplares !== 0) await agregarEjemplares(noEjemplares, idLibro);

        res.status(200).json({ success: true, message: 'Libro editado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Función para generar la firma
function generateSignature(data, publicId) {
    const signature = `public_id=${publicId}&timestamp=${data.get('timestamp')}${process.env.API_SECRET}`;
    return CryptoJS.MD5(signature).toString(CryptoJS.enc.Base64);
}

export const eliminarImagenAnterior = async (req, res) => {
    try {
        const publicIdAnterior = req.body.public_id;

        const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/destroy`;
        
        const data = new FormData();
        data.append('public_id', publicIdAnterior);
        data.append('api_key', process.env.API_KEY);
        data.append('timestamp', Math.floor(Date.now() / 1000));
        data.append('signature', generateSignature(data, publicIdAnterior));
    
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Intenta parsear la respuesta como JSON
        const result = await response.json().catch(() => {
            throw new Error('La respuesta no es JSON válido');
        });

        if (result.result === 'ok') {
            res.status(200).json({ success: true, message: 'Imagen anterior eliminada correctamente' });
        } else {
            res.status(500).json({ success: false, error: 'Error al borrar la imagen' });
            console.log('Error al borrar la imagen', result);
        }
    } catch (error) {
        console.log('Error al borrar la imagen', error);
        res.status(500).json({ success: false, error: 'Error al eliminar la imagen anterior' });
    }
};