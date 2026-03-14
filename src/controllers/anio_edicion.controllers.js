import * as anio_edicionModel from '../models/anio_edicion.models.js';

export const getAnios = async (req, res) => {
    try {
        const data = await anio_edicionModel.getAllAnios();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarAnio = async (req, res) => {
    try {
        const { Anio_edicion } = req.body;
        const result = await anio_edicionModel.createAnio(Anio_edicion);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarAnio = async (req, res) => {
    try {
        const { Id_anio_edicion, Anio_edicion } = req.body;
        const result = await anio_edicionModel.updateAnio(Id_anio_edicion, Anio_edicion);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarAnio = async (req, res) => {
    try {
        const { Id_anio_edicion } = req.body;
        const result = await anio_edicionModel.deleteAnio(Id_anio_edicion);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};