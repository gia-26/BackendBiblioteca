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
        const fechaDia1 = new Date((await estimacionModels.getPrimeraVezPrestado(idLibro, fecha)).primera_vez_prestado);
        
        const fechaInicial = new Date(fechaDia1);
        fechaInicial.setDate(fechaInicial.getDate() + 4);

        const fechaDia4 = fechaInicial.toISOString().split('T')[0];

        const dia1 = await estimacionModels.getDia1(idLibro, fechaDia1.toISOString().split('T')[0]);
        const dia4 = await estimacionModels.getDia4(idLibro, fechaDia4);
        
        res.status(200).json({ dia1, dia4 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}