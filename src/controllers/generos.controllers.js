import * as generosModels from '../models/generos.models.js';

// OBTENER GENEROS
export const getAllGeneros = async (req, res) => {
    try {
        const generos = await generosModels.getAllGeneros();
        res.status(200).json(generos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// AGREGAR GENERO
export const agregarGenero = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        await generosModels.agregarGenero({ Nombre });
        res.status(200).json({ message: "Género agregado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// EDITAR GENERO
export const editarGenero = async (req, res) => {
    try {
        const { Id_genero, Nombre } = req.body;
        if (!Id_genero || !Nombre) {
            return res.status(400).json({ error: "Faltan datos" });
        }
        await generosModels.editarGenero({ Id_genero, Nombre });
        res.status(200).json({ message: "Género actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR GENERO
export const eliminarGenero = async (req, res) => {
    try {
        const { Id_genero } = req.body;
        if (!Id_genero) {
            return res.status(400).json({ error: "Falta el id" });
        }

        // ✅ Verificar si está asignado a algún libro
        const asignado = await generosModels.generoEstaAsignado(Id_genero);
        if (asignado) {
            return res.status(400).json({
                error: "Este género no se puede eliminar porque está asignado a uno o más libros."
            });
        }

        await generosModels.eliminarGenero({ Id_genero });
        res.status(200).json({ message: "Género eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};