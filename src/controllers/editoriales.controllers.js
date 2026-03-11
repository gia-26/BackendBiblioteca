import * as editorialesModel from '../models/editoriales.models.js';

export const getEditoriales = async (req, res) => {
    try {
        const data = await editorialesModel.getAllEditoriales();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarEditorial = async (req, res) => {
    try {
        const { Nombre, Pais } = req.body;
        const result = await editorialesModel.createEditorial(Nombre, Pais);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarEditorial = async (req, res) => {
    try {
        const { Id_editorial, Nombre, Pais } = req.body;
        const result = await editorialesModel.updateEditorial(Id_editorial, Nombre, Pais);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarEditorial = async (req, res) => {
    try {
        const { Id_editorial } = req.body;
        const result = await editorialesModel.deleteEditorial(Id_editorial);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};