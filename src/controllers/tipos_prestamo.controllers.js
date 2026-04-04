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
        const { Tipo_prestamo } = req.body;    // ✅ corregido
        const result = await tiposPrestamoModel.createTipoPrestamo(Tipo_prestamo);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarTipoPrestamo = async (req, res) => {
    try {
        const { Id_tipo_prestamo, Tipo_prestamo } = req.body;    // ✅ corregido
        const result = await tiposPrestamoModel.updateTipoPrestamo(Id_tipo_prestamo, Tipo_prestamo);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTipoPrestamo = async (req, res) => {
    try {
        const { Id_tipo_prestamo } = req.body;
        const result = await tiposPrestamoModel.deleteTipoPrestamo(Id_tipo_prestamo);
        if (result.error) {
            return res.status(400).json({ success: false, message: result.message });
        }
        res.status(200).json({ success: true, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};