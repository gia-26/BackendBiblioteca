import * as rolesModels from "../models/roles.models.js";

export const getAllRoles = async (req, res) => {
    try {
        const roles = await rolesModels.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarRol = async (req, res) => {
    try {
        const { Nombre } = req.body;
        const result = await rolesModels.createRol(Nombre);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarRol = async (req, res) => {
    try {
        const { Id_rol, Nombre } = req.body;
        const result = await rolesModels.updateRol(Id_rol, Nombre);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarRol = async (req, res) => {
    try {
        const { Id_rol } = req.body;

        // ✅ Verificar si está asignado a algún usuario
        const asignado = await rolesModels.rolEstaAsignado(Id_rol);
        if (asignado) {
            return res.status(400).json({
                error: "Este tipo de rol no se puede eliminar porque está asignado a uno o más usuarios."
            });
        }

        const result = await rolesModels.deleteRol(Id_rol);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};