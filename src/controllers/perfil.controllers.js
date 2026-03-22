import bcrypt from 'bcryptjs';
import * as perfilModels from '../models/perfil.models.js';

// CORREGIDO - pasa sesion al model
export const getPerfil = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const sesion = req.usuario.rol;
        const data = await perfilModels.getTelefono(idUsuario, sesion);
        if (!data) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CORREGIDO - pasa sesion al model
export const updateTelefono = async (req, res) => {
    try {
        const { idUsuario, telefono } = req.body;
        const sesion = req.usuario.rol;
        const ok = await perfilModels.updateTelefono(idUsuario, sesion, telefono);
        if (!ok) return res.status(400).json({ message: 'No se pudo actualizar el teléfono' });
        res.json({ success: true, message: 'Teléfono actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { idUsuario, passwordActual, passwordNueva } = req.body;
        const sesion = req.usuario.rol;

        const datos = await perfilModels.getPasswordHash(idUsuario, sesion);
        if (!datos) return res.status(404).json({ message: 'Usuario no encontrado' });

        const esValida = await bcrypt.compare(passwordActual, datos.password_hash);
        if (!esValida) return res.status(401).json({ message: 'La contraseña actual es incorrecta' });

        const nuevoHash = await bcrypt.hash(passwordNueva, 10);
        const ok = await perfilModels.updatePassword(idUsuario, sesion, nuevoHash);

        if (!ok) return res.status(400).json({ message: 'No se pudo actualizar la contraseña' });
        res.json({ success: true, message: 'Contraseña actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};