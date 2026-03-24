import * as estimacionModels from '../models/estimacion.models.js';

export const getAllLibrosEstimaciones = async (req, res) => {
    try {
        const librosEstimaciones = await estimacionModels.getAllLibrosEstimaciones();
        res.status(200).json(librosEstimaciones);
    } catch (error) {
        console.error('Error al obtener las estimaciones de libros:', error);
        res.status(500).json({ error: error.message });
    }
}

export const getDatosLibro = async (req, res) => {
    try {
        const { idLibro, fecha } = req.query;
        
        // Sumar 4 días y mantener formato YYYY-MM-DD
        const fechaBase = new Date(fecha);
        const fechaInicio = fechaBase.toISOString().split('T')[0]; // formato YYYY-MM-DD
        fechaBase.setDate(fechaBase.getDate() + 4);
        const fechaMas4Dias = fechaBase.toISOString().split('T')[0]; // formato YYYY-MM-DD
        
        const dia1 = await estimacionModels.getDia1(idLibro, fechaInicio);
        const dia4 = await estimacionModels.getDia4(idLibro, fechaMas4Dias);
        
        res.status(200).json({ dia1, dia4 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}