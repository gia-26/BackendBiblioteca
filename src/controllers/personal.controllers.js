import bcrypt from 'bcryptjs';
import * as personalModel from '../models/personal.models.js';

export const getPersonalById = async (req, res) => {
    try {
        const id = req.params.id;
        const personal = await personalModel.getAllPersonalById(id);
        // if (!personal) return res.status(404).json({ message: 'Personal no encontrado' });
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
        const Id_rol = req.body.Id_rol;

        if (!Id_personal || !password || !Id_rol) return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const updated = await personalModel.editUsuario(Id_personal, passwordHash, Id_rol);
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPersonal = async (req, res) => {
    try {
        const idPersonal = req.body.Id_personal;
        const deleted = await personalModel.eliminarPersonal(idPersonal);
        if (!deleted) return res.status(404).json({ message: 'Personal no encontrado' });

        res.status(200).json({ success: true, message: 'Personal eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
}

export const guardarPersonal = async (req, res) => {
    try {
        const id_trabajador = req.body.Id_trabajador;
        const Id_personal = req.body.Id_personal;
        const id_rol = req.body.Id_rol;
        const password = req.body.Password;
        
        if (!id_trabajador || !Id_personal || !id_rol || !password) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const guardado = await personalModel.guardarPersonal(Id_personal, id_trabajador, id_rol, passwordHash);
        
        if (!guardado) return res.status(400).json({ success: false, message: 'Error al guardar el personal' });
        
        res.status(201).json({ success: true, message: 'Personal guardado con éxito', idPersonal: guardado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const generarIdPersonal = async (req, res) => {
    try {
        const idPersonal = await personalModel.generarId();
        console.log('ID generado:', idPersonal);
        res.status(200).json(idPersonal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTrabajadorById = async (req, res) => {
    try {
        const id = req.params.id;
        const existeTrabajador = await personalModel.validarIdTrabajador(id);
        if (!existeTrabajador) return res.status(400).json({ success: false, message: 'El trabajador ya está registrado' });
        const trabajador = await personalModel.getTrabajadorById(id);
        res.status(200).json( {success: true, data: trabajador});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}