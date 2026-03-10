import * as personalModel from '../models/personal.models.js';

export const getAllPersonal = async (req, res) => {
    try {
        const personal = await personalModel.getAllPersonal();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}