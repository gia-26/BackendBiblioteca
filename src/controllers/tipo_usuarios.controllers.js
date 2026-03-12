import * as tiposModel from '../models/tipo_usuarios.models.js';

export const getTipos = async (req, res) => {
    try {
        const data = await tiposModel.getAllTipos();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarTipo = async (req, res) => {
    try {
        const { Tipo_usuario } = req.body;
        const result = await tiposModel.createTipo(Tipo_usuario);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarTipo = async (req, res) => {
    try {
        const { Id_tipo_usuario, Tipo_usuario } = req.body;
        const result = await tiposModel.updateTipo(Id_tipo_usuario, Tipo_usuario);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTipo = async (req, res) => {
    try {
        const { Id_tipo_usuario } = req.body;
        const result = await tiposModel.deleteTipo(Id_tipo_usuario);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};