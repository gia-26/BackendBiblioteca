import * as autoresModels from "../models/autores.models.js";

export const getAllAutores = async (req, res) => {
    try {
        const autores = await autoresModels.getAllAutores();
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}