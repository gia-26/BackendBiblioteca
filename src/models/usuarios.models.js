import db from '../config/db.js';

export const getAllTiposUsuario = async () => {
  const [rows] = await db.query('SELECT Id_tipo_usuario, Tipo_usuario FROM tbl_tipo_usuarios');
  return rows;
}

export const createUsuario = async (idUsuario, idTipoUsuario, passwordHash) => {
    const [result] = await db.query(
        'INSERT INTO tbl_usuarios(Id_usuario, Id_tipo_usuario, Password, Estado) VALUES (?, ?, ?, ?)',
        [idUsuario, idTipoUsuario, passwordHash, '1']
    );
    return result.insertId;
};

export const editUsuarioPassword = async (idUsuario, passwordHash) => {
    const [result] = await db.query(
        'UPDATE tbl_usuarios SET Password = ? WHERE Id_usuario = ?',
        [passwordHash, idUsuario]
    );
    return result.affectedRows > 0;
};

export const getAllUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT
      u.Id_usuario,
        a.Nombre,
        a.Apellido_P,
        a.Apellido_M,
        tu.Tipo_usuario
    FROM tbl_usuarios u
    INNER JOIN tbl_tipo_usuarios tu ON u.Id_tipo_usuario = tu.Id_tipo_usuario
    RIGHT JOIN tbl_alumnos a ON a.Id_alumno = u.Id_usuario
    WHERE u.Estado != 0 AND a.Estado != 0
    UNION ALL
    SELECT
      u.Id_usuario,
        t.Nombre,
        t.Apellido_P,
        t.Apellido_M,
        tu.Tipo_usuario
    FROM tbl_usuarios u
    INNER JOIN tbl_tipo_usuarios tu ON u.Id_tipo_usuario = tu.Id_tipo_usuario
    RIGHT JOIN tbl_trabajadores t ON t.Id_trabajador = u.Id_usuario
    WHERE u.Estado != 0;
  `);
  return rows;
};

export const getUsuariosById = async ({id, tipo}) => {
    if (tipo === 'TU001') {
      const [rows] = await db.query(`
        SELECT
          a.Id_alumno,
          CONCAT(a.Nombre, " ", a.Apellido_P, " ", a.Apellido_M) AS NombreCompleto,
          c.Nombre_carrera AS Carrera
        FROM tbl_alumnos a
        INNER JOIN tbl_carreras c ON a.Id_carrera = c.Id_carrera
        WHERE a.Id_alumno = ?
      `, [id]);
      return rows[0];
    }
    else if (tipo === 'TU002') {
      const [rows] = await db.query(`
        SELECT
          t.Id_trabajador,
          CONCAT(t.Nombre, " ", t.Apellido_P, " ", t.Apellido_M) AS NombreCompleto
        FROM tbl_trabajadores t
        WHERE t.Id_trabajador = ?
      `, [id]);
      return rows[0];
    }
}

// Obtener lista de multas del usuario
export const getMultasByUsuario = async (idUsuario) => {

  const [rows] = await db.query(`
    SELECT 
      m.Id_multa,
      lib.Titulo,
      m.Monto,
      m.Dias_excedidos,
      pres.Fecha_devolucion,
      pres.Fecha_devolucion_real
    FROM tbl_multas m
    INNER JOIN tbl_prestamos pres 
      ON m.Id_prestamo = pres.Id_prestamo
    INNER JOIN tbl_ejemplares ejm 
      ON pres.Id_ejemplar = ejm.Id_ejemplar
    INNER JOIN tbl_libros lib 
      ON ejm.Id_libro = lib.Id_libro
    WHERE pres.Id_usuario = ?
    ORDER BY m.Id_multa DESC
  `, [idUsuario]);

  return rows;
};

// Obtener resumen
export const getResumenMultas = async (idUsuario) => {

  const [rows] = await db.query(`
    SELECT 
      IFNULL(SUM(m.Monto),0) AS MontoTotal
    FROM tbl_multas m
    INNER JOIN tbl_prestamos pres ON m.Id_prestamo = pres.Id_prestamo
    WHERE pres.Id_usuario = ?
  `, [idUsuario]);

  return rows[0];
};

// historial de prestamos

export const getEstadisticasUsuario = async (idUsuario) => {
  const [[totales]] = await db.query(`
    SELECT COUNT(*) AS prestamosTotales
    FROM tbl_prestamos
    WHERE Id_usuario = ?
  `, [idUsuario]);

  const [[activos]] = await db.query(`
    SELECT COUNT(*) AS librosActivos
    FROM tbl_prestamos
    WHERE Id_usuario = ?
      AND Id_estado_prestamo = 'EP001'
  `, [idUsuario]);

  const [[devueltos]] = await db.query(`
    SELECT COUNT(*) AS librosDevueltos
    FROM tbl_prestamos
    WHERE Id_usuario = ?
      AND Id_estado_prestamo = 'EP002'
  `, [idUsuario]);

  return {
    prestamosTotales: totales.prestamosTotales,
    librosActivos: activos.librosActivos,
    librosDevueltos: devueltos.librosDevueltos
  };
};

export const getPrestamosUsuario = async (idUsuario) => {
  const [rows] = await db.query(`
    SELECT 
      p.*, 
      l.Titulo AS titulo,
      l.Autor AS autor,
      CASE 
        WHEN p.Id_estado_prestamo = 'EP001' THEN 'Activo'
        WHEN p.Id_estado_prestamo = 'EP002' THEN 'Entregado'
        WHEN p.Id_estado_prestamo = 'EP003' THEN 'Expirado'
        ELSE 'Desconocido'
      END AS estado
    FROM tbl_prestamos p
    INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
    INNER JOIN tbl_libros l ON e.Id_libro = l.Id_libro
    WHERE p.Id_usuario = ?
  `, [idUsuario]);

  return rows;
};