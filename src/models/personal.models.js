import db from '../config/db.js';

export const getAllPersonal = async () => {
    const [rows] = await db.query(`
        SELECT
            pers.Id_personal,
            pers.Id_trabajador,
            trab.Nombre,
            trab.Apellido_P,
            trab.Apellido_M,
            rols.Tipo_rol,
            rols.Id_rol
        FROM tbl_personal AS pers
        INNER JOIN tbl_trabajadores trab ON trab.Id_trabajador = pers.Id_trabajador
        INNER JOIN tbl_roles rols ON rols.Id_rol = pers.Id_rol;   
    `);
    return rows;
}

export const getAllPersonalById = async (id) => {
    const [rows] = await db.query(`
        SELECT
            pers.Id_personal,
            pers.Id_trabajador,
            trab.Nombre,
            trab.Apellido_P,
            trab.Apellido_M,
            rols.Tipo_rol,
            rols.Id_rol
        FROM tbl_personal AS pers
        INNER JOIN tbl_trabajadores trab ON trab.Id_trabajador = pers.Id_trabajador
        INNER JOIN tbl_roles rols ON rols.Id_rol = pers.Id_rol
        WHERE pers.Id_personal LIKE ?
    `, [`%${id}%`]);
    return rows;
};

export const getAllTiposRoles = async () => {
    const [rows] = await db.query(`
        SELECT Id_rol, Tipo_rol FROM tbl_roles;
    `);
    return rows;
}

export const editUsuarioPassword = async (idUsuario, passwordHash) => {
    const [result] = await db.query(
        'UPDATE tbl_personal SET Password = ? WHERE Id_personal = ?',
        [passwordHash, idUsuario]
    );
    return result.affectedRows > 0;
};

export const eliminarPersonal = async (idPersonal) => {
    const [result] = await db.query(
        'UPDATE tbl_personal SET Estado = 0 WHERE Id_personal = ?',
        [idPersonal]
    );
    return result.affectedRows > 0;
}

export const guardarPersonal = async (Id_personal, Id_trabajador, Id_rol, Password) => {
    const [result] = await db.query(
        'INSERT INTO tbl_personal (Id_personal, Id_trabajador, Password, Id_rol, Estado) VALUES (?, ?, ?, ?, ?)',
        [Id_personal, Id_trabajador, Password, Id_rol, 1]
    );
    return result.insertId;
}

export const generarIdPersonal = async () => {
    const [rows] = await db.query(`
        SELECT MAX(Id_personalAI) AS maxId FROM tbl_personal;
    `);
    const maxId = rows[0].maxId || 0;
    const nuevoId = maxId + 1;
    return `PER${nuevoId.toString().padStart(3, '0')}`;
}