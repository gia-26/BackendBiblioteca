import db from '../config/db.js';

// Obtener todas las áreas
export const getAllAreas = async () => {
    const [rows] = await db.query(
        'SELECT * FROM tbl_areas_conocimiento ORDER BY N_estante ASC'
    );
    return rows;
};

// Generar ID autoincremental (AC001, AC002...)
const generarNuevoId = async () => {
    const [rows] = await db.query(
        'SELECT Id_area_conocimiento FROM tbl_areas_conocimiento ORDER BY Id_area_conocimiento DESC LIMIT 1'
    );
    if (rows.length > 0) {
        const ultimo = rows[0].Id_area_conocimiento;
        const num = parseInt(ultimo.substring(2)) + 1;
        return 'AC' + String(num).padStart(3, '0');
    }
    return 'AC001';
};

// Agregar área
export const createArea = async (areaConocimiento, nEstante) => {
    const nuevoId = await generarNuevoId();
    await db.query(
        'INSERT INTO tbl_areas_conocimiento (Id_area_conocimiento, Area_conocimiento, N_estante) VALUES (?, ?, ?)',
        [nuevoId, areaConocimiento, nEstante]
    );
    return { id: nuevoId };
};

// Editar área
export const updateArea = async (id, areaConocimiento, nEstante) => {
    await db.query(
        'UPDATE tbl_areas_conocimiento SET Area_conocimiento = ?, N_estante = ? WHERE Id_area_conocimiento = ?',
        [areaConocimiento, nEstante, id]
    );
    return { updated: true };
};

// Eliminar área
export const deleteArea = async (id) => {
    await db.query(
        'DELETE FROM tbl_areas_conocimiento WHERE Id_area_conocimiento = ?',
        [id]
    );
    return { deleted: true };
};