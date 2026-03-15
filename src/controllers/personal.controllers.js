import * as personalModel from '../models/personal.models.js';

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