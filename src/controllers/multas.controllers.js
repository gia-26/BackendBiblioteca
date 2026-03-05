import * as multasModel from "../models/multas.models.js";

export const getAllMultas = async (req, res) => {
    try {
        const multas = await multasModel.getAllMultas();
        res.status(200).json(multas);   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const generarMultas = async (req, res) => {

    const token = req.query.token;

    if (token !== process.env.CRON_SECRET) {
        return res.status(403).json({ message: "No autorizado" });
    }

    try {
        await multasModel.generarMultas();
        res.status(200).json({ message: "Multas generadas correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}