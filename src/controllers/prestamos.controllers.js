import * as prestamosModel from '../models/prestamos.models.js';

//validar todos los controladores para evitar errores y manejar excepciones
export const getAllEjemplares = async (req, res) => {
  try {
    const ejemplares = await prestamosModel.getAllEjemplares();
    res.status(200).json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllEjemplaresByTitulo = async (req, res) => {
  try {
    const titulo = req.query.q || '';
    const ejemplares = await prestamosModel.getAllEjemplaresBuscar(titulo);
    res.status(200).json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllTiposPrestamos = async (req, res) => {
  try {
    const tiposPrestamos = await prestamosModel.getAllTiposPrestamos();
    res.status(200).json(tiposPrestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const registrarPrestamo = async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body;
    const result = await prestamosModel.registrarPrestamo(data);
    console.log("RESULTADO CONTROLADOR:", result);
    //PENDIENTE: Revisar el resultado del SP para determinar si fue exitoso o no
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllPrestamos = async (req, res) => {
  try {
    const prestamos = await prestamosModel.getAllPrestamos();
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const devolverPrestamo = async (req, res) => {
  try {
    const idPrestamo = req.body.id;
    const result = await prestamosModel.devolverPrestamo(idPrestamo);
    console.log("RESULTADO CONTROLADOR:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const renovarPrestamo = async (req, res) => {
  try {
    const idPrestamo = req.body.idPrestamo;
    const idUsuario = req.body.idUsuario;
    const result = await prestamosModel.renovarPrestamo(idPrestamo, idUsuario);
    console.log("RESULTADO CONTROLADOR:", result);
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const buscarPrestamos = async (req, res) => {
  try {
    const id = req.query.id || '';
    const tipo = req.query.tipo || '';

    if (!id || !tipo) {
      res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
    }

    let prestamos;

    switch (tipo) {
      case "idUsuario":
        prestamos = await prestamosModel.getAllPrestamosByUsuario(id);
        break;
      case "idLibro":
        prestamos = await prestamosModel.getAllPrestamosByLibro(id);
        break;
      default:
        res.status(400).json({ error: 'Tipo de búsqueda no válido' });
    }

    return res.status(200).json(prestamos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}