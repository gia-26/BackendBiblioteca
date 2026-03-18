import * as tiposPrestamoModel from '../models/tipos_prestamo.models.js';

export const getTiposPrestamo = async (req, res) => {
    try {
        const data = await tiposPrestamoModel.getAllTiposPrestamo();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarTipoPrestamo = async (req, res) => {
    try {
        const { Nombre } = req.body;
        const result = await tiposPrestamoModel.createTipoPrestamo(Nombre);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarTipoPrestamo = async (req, res) => {
    try {
        const { Id_tipo_prestamo, Nombre } = req.body;
        const result = await tiposPrestamoModel.updateTipoPrestamo(Id_tipo_prestamo, Nombre);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTipoPrestamo = async (req, res) => {
    try {
        const { Id_tipo_prestamo } = req.body;
        const result = await tiposPrestamoModel.deleteTipoPrestamo(Id_tipo_prestamo);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};