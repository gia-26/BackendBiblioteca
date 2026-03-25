import bcrypt from 'bcryptjs';
import * as usuariosModels from '../models/usuarios.models.js';

export const editPasswordUsuario = async (req, res) => {
    try {
        const Id_usuario = req.body.Id_usuario;
        const password = req.body.password;
        if (!Id_usuario || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const updated = await usuariosModels.editUsuarioPassword(Id_usuario, passwordHash);
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

   const idUsuario = req.usuario.id; // ← ya no hardcodeado

    const multas = await usuariosModels.getMultasByUsuario(idUsuario);

    res.status(200).json(multas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de multas
export const getResumenMultas = async (req, res) => {
  try {

     const idUsuario = req.usuario.id; // ← usar el ID del token

    const resumen = await usuariosModels.getResumenMultas(idUsuario);

    res.status(200).json(resumen);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// historial de prestamos
export const getEstadisticasUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.id 
    const data = await usuariosModels.getEstadisticasUsuario(idUsuario);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrestamosUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.id
    const prestamos = await usuariosModels.getPrestamosUsuario(idUsuario);
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModels.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}