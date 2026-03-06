import * as usuariosModels from '../models/usuarios.models.js';

export const getUsuariosById = async (req, res) => {
    try {
        if (!req.query.id || !req.query.tipo) {
            return res.status(400).json({
                error: "Faltan parámetros id o tipo"
            });
        }
        const usuario = await usuariosModels.getUsuariosById(req.query);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllTiposUsuario = async (req, res) => {
  try {
    const tiposUsuario = await usuariosModels.getAllTiposUsuario();
    res.status(200).json(tiposUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Obtener lista de multas
export const getMultasByUsuario = async (req, res) => {
  try {

    //  Aquí puedes cambiar después para usar sesión real
    const idUsuario = req.usuario?.id || 'ALU001';

    const multas = await usuariosModels.getMultasByUsuario(idUsuario);

    res.status(200).json(multas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de multas
export const getResumenMultas = async (req, res) => {
  try {

    const resumen = await usuariosModels.getResumenMultas();

    res.status(200).json(resumen);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// historial de prestamos

export const getEstadisticasUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id || 'ALU001'; // Ajustar según tu auth
    const data = await prestamosModel.getEstadisticasUsuario(idUsuario);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrestamosUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id || 'ALU001';
    const prestamos = await prestamosModel.getPrestamosUsuario(idUsuario);
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};