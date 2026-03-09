import db from '../config/db.js';

export const getUsuariosById = async ({id, tipo}) => {
    if (tipo === 'TU001') {
        const [rows] = await db.query('SELECT Nombre, Id_alumno AS id FROM tbl_alumnos WHERE Id_alumno = ?', [id]);
        return rows[0];
    }
    else if (tipo === 'TU002') {
        const [rows] = await db.query('SELECT Nombre, Id_trabajador AS id FROM tbl_trabajadores WHERE Id_trabajador = ?', [id]);
        return rows[0];
    }
}

export const getAllTiposUsuario = async () => {
  const [rows] = await db.query(`SELECT * FROM tbl_tipo_usuarios`);
  return rows;
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
export const getResumenMultas = async () => {

  const [rows] = await db.query(`
    SELECT 
      IFNULL(SUM(Monto),0) AS MontoTotal
    FROM tbl_multas
  `);

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
    SELECT p.*, l.Titulo 
    FROM tbl_prestamos p
    INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
    INNER JOIN tbl_libros l ON e.Id_libro = l.Id_libro
    WHERE p.Id_usuario = ?
  `, [idUsuario]);
  return rows;
};