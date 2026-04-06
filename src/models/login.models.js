import db from '../config/db.js';

export const findUsuarioById = async (idUsuario, sesion) => {
  let rows = null;
  if (sesion === 'Miembro') {
    [rows] = await db.query(`
      SELECT
        u.Id_usuario AS 'id',
        CONCAT(a.Nombre," ", a.Apellido_P," ", a.Apellido_M) AS 'nombre',
        tu.Tipo_usuario AS 'rol',
        u.Password AS 'password_hash'
      FROM tbl_usuarios u
      INNER JOIN tbl_tipo_usuarios tu ON u.Id_tipo_usuario = tu.Id_tipo_usuario
      RIGHT JOIN tbl_alumnos a ON a.Id_alumno = u.Id_usuario
      WHERE u.Estado != 0 AND a.Estado != 0 AND u.Id_usuario = ?
      UNION ALL
      SELECT
        u.Id_usuario AS 'id',
        CONCAT(t.Nombre," ", t.Apellido_P," ", t.Apellido_M) AS 'nombre',
        tu.Tipo_usuario AS 'rol',
        u.Password AS 'password_hash'
      FROM tbl_usuarios u
      INNER JOIN tbl_tipo_usuarios tu ON u.Id_tipo_usuario = tu.Id_tipo_usuario
      RIGHT JOIN tbl_trabajadores t ON t.Id_trabajador = u.Id_usuario
      WHERE u.Estado != 0 AND u.Id_usuario = ?;   
    `, [idUsuario, idUsuario]);
  }
  else if (sesion === 'ROL001' || sesion === 'ROL002' || sesion === 'ROL003') {
    [rows] = await db.query(`
      SELECT
        p.Id_personal AS 'id',
        CONCAT(t.Nombre, " " ,t.Apellido_P, " " ,t.Apellido_M) AS 'nombre',
        p.Id_rol AS 'rol',
        p.Password AS 'password_hash'
      FROM tbl_personal p
      INNER JOIN tbl_trabajadores t ON t.Id_trabajador = p.Id_trabajador
      WHERE p.Id_personal = ? AND p.Estado != 0;
    `, [idUsuario]);
  }
  return rows[0] || null;
};