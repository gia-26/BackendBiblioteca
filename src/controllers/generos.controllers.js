import * as generosModels from "../models/generos.models.js";


export const getAllGeneros = async (req, res) => {
    try {
        const generos = await generosModels.getAllGeneros();
        res.status(200).json(generos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const agregarGenero = async (req, res) => {
    try {
        const { Nombre } = req.body;
        const result = await generosModels.createGenero(Nombre);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarGenero = async (req, res) => {
    try {
        const { Id_genero, Nombre } = req.body;
        const result = await generosModels.updateGenero(Id_genero, Nombre);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarGenero = async (req, res) => {
    try {
        const { Id_genero } = req.body;

        // ✅ Verificar si está asignado a algún libro
        const asignado = await generosModels.generoEstaAsignado(Id_genero);
        if (asignado) {
            return res.status(400).json({
                error: "Este género no se puede eliminar porque está asignado a uno o más libros."
            });
        }

        const result = await generosModels.deleteGenero(Id_genero);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};