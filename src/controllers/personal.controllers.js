import bcrypt from 'bcryptjs';
import * as personalModel from '../models/personal.models.js';

export const getPersonalById = async (req, res) => {
    try {
        const id = req.params.id;
        const personal = await personalModel.getAllPersonalById(id);
        if (!personal) return res.status(404).json({ message: 'Personal no encontrado' });
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllPersonal = async (req, res) => {
    try {
        const personal = await personalModel.getAllPersonal();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTiposRoles = async (req, res) => {
    try {
        const roles = await personalModel.getAllTiposRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

export const editPasswordUsuario = async (req, res) => {
    try {
        const Id_personal = req.body.Id_personal;
        const password = req.body.password;
        if (!Id_personal || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const updated = await personalModel.editUsuarioPassword(Id_personal, passwordHash);
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};