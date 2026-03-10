import * as bibliotecaModel from '../models/informacion_biblioteca.models.js';

//OBTENER INFORMACION
export const getInformacion = async (req, res) => {
  try {
    const info = await bibliotecaModel.getInformacion();
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//ACTUALIZAR INFORMACION
export const updateInformacion = async (req, res) => {
  try {

    const data = req.body;

    const result = await bibliotecaModel.updateInformacion(data);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//OBTENER MISION VISION OBJETIVO
export const getMVO = async (req, res) => {
  try {

    const data = await bibliotecaModel.getMVO();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//ACTUALIZAR MISION
export const updateMision = async (req, res) => {
  try {

    const mision = req.body.mision;

    const result = await bibliotecaModel.updateMision(mision);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//ACTUALIZAR VISION
export const updateVision = async (req, res) => {
  try {

    const vision = req.body.vision;

    const result = await bibliotecaModel.updateVision(vision);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//ACTUALIZAR OBJETIVO
export const updateObjetivo = async (req, res) => {
  try {

    const objetivo = req.body.objetivo;

    const result = await bibliotecaModel.updateObjetivo(objetivo);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}