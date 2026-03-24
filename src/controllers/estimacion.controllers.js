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
        
        console.log('ID del libro:', idLibro);
        console.log('Fecha proporcionada:', fecha);

        // Sumar 4 días y mantener formato YYYY-MM-DD
        const fechaInicial = new Date(await estimacionModels.getPrimeraVezPrestado(idLibro, fecha));
        const fechaDia1 = fechaInicial;
        fechaInicial.setDate(fechaInicial.getDate() + 4);
        const fechaDia4 = fechaInicial;

        console.log('Fecha de inicio (día 1):', fechaDia1);
        console.log('Fecha más 4 días (día 4):', fechaDia4);

        const dia1 = await estimacionModels.getDia1(idLibro, fechaDia1);
        const dia4 = await estimacionModels.getDia4(idLibro, fechaDia4);
        
        res.status(200).json({ dia1, dia4 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}