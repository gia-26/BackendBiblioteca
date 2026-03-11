import * as area_conocimientoModel from '../models/area_conocimiento.models.js';

export const getAreas = async (req, res) => {
    try {
        const data = await area_conocimientoModel.getAllAreas();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarArea = async (req, res) => {
    try {
        const { Area_conocimiento, N_estante } = req.body;
        const result = await area_conocimientoModel.createArea(Area_conocimiento, N_estante);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarArea = async (req, res) => {
    try {
        const { Id_area_conocimiento, Area_conocimiento, N_estante } = req.body;
        const result = await area_conocimientoModel.updateArea(Id_area_conocimiento, Area_conocimiento, N_estante);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarArea = async (req, res) => {
    try {
        const { Id_area_conocimiento } = req.body;
        const result = await area_conocimientoModel.deleteArea(Id_area_conocimiento);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};