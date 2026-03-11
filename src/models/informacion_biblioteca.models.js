import db from '../config/db.js';

//OBTENER INFORMACION DE LA BIBLIOTECA
export const getInformacion = async () => {
  const [rows] = await db.query(`
    SELECT 
      quienes_somos AS quienesSomos,
      historia
    FROM tbl_biblioteca_info
    LIMIT 1
  `);
  return rows[0];
}

//ACTUALIZAR QUIENES SOMOS O HISTORIA
export const updateInformacion = async (data) => {

  if(data.quienesSomos){
    await db.query(`
      UPDATE tbl_biblioteca_info 
      SET quienes_somos = ?
    `,[data.quienesSomos]);
  }

  if(data.historia){
    await db.query(`
      UPDATE tbl_biblioteca_info 
      SET historia = ?
    `,[data.historia]);
  }

  return { success: true };
}


//OBTENER MISION VISION OBJETIVO
export const getMVO = async () => {
  const [rows] = await db.query(`
    SELECT 
      mision,
      vision,
      objetivo
    FROM tbl_biblioteca_info
    LIMIT 1
  `);
  return rows[0];
}


//ACTUALIZAR MISION
export const updateMision = async (mision) => {

  await db.query(`
    UPDATE tbl_biblioteca_info
    SET mision = ?
  `,[mision]);

  return { success: true };
}


//ACTUALIZAR VISION
export const updateVision = async (vision) => {

  await db.query(`
    UPDATE tbl_biblioteca_info
    SET vision = ?
  `,[vision]);

  return { success: true };
}


//ACTUALIZAR OBJETIVO
export const updateObjetivo = async (objetivo) => {

  await db.query(`
    UPDATE tbl_biblioteca_info
    SET objetivo = ?
  `,[objetivo]);

  return { success: true };
}