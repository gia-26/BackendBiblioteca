import * as autoresModels from "../models/autores.models.js";

export const getAllAutores = async (req, res) => {
    try {
        const autores = await autoresModels.getAllAutores();
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarAutor = async (req, res) => {
    try {
        const { Nombre } = req.body;
        const result = await autoresModels.createAutor(Nombre);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarAutor = async (req, res) => {
    try {
        const { Id_autor, Nombre } = req.body;
        const result = await autoresModels.updateAutor(Id_autor, Nombre);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarAutor = async (req, res) => {
    try {
        const { Id_autor } = req.body;

        // ✅ Verificar si está asignado a algún libro
        const asignado = await autoresModels.autorEstaAsignado(Id_autor);
        if (asignado) {
            return res.status(400).json({
                error: "Este autor no se puede eliminar porque está asignado a uno o más libros."
            });
        }

        const result = await autoresModels.deleteAutor(Id_autor);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};