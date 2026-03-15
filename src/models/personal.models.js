import db from '../config/db.js';

export const getAllPersonal = async () => {
    const [rows] = await db.query(`
        SELECT
            pers.Id_personal,
            trab.Nombre,
            trab.Apellido_P,
            trab.Apellido_M,
            rols.Tipo_rol
        FROM tbl_personal AS pers
        INNER JOIN tbl_trabajadores trab ON trab.Id_trabajador = pers.Id_trabajador
        INNER JOIN tbl_roles rols ON rols.Id_rol = pers.Id_rol;   
    `);
    return rows;
}

export const getAllTiposRoles = async () => {
    const [rows] = await db.query(`
        SELECT Id_rol, Tipo_rol FROM tbl_roles;
    `);
    return rows;
}