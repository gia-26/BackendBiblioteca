import db from '../config/db.js';

//OBTENER INFORMACION DE LA BIBLIOTECA
export const getInformacion = async () => {
  const [rows] = await db.query(`
    SELECT 
      QuienesSomos AS QuienesSomos,
      NuestraHistoria
    FROM tbl_informacion_biblioteca
    LIMIT 1
  `);
  return rows[0];
}

//ACTUALIZAR QUIENES SOMOS O HISTORIA
export const updateInformacion = async (data) => {

  if(data.quienesSomos){
    await db.query(`
      UPDATE tbl_informacion_biblioteca 
      SET QuienesSomos = ?
    `,[data.quienesSomos]);
  }

  if(data.historia){
    await db.query(`
      UPDATE tbl_informacion_biblioteca
      SET NuestraHistoria = ?
    `,[data.historia]);
  }

  return { success: true };
}


//OBTENER MISION VISION OBJETIVO
export const getMVO = async () => {
  const [rows] = await db.query(`
    SELECT 
      Mision,
      Vision,
      Objetivo
    FROM tbl_informacion_biblioteca
    LIMIT 1
  `);
  return rows[0];
}


//ACTUALIZAR MISION
export const updateMision = async (mision) => {

  await db.query(`
    UPDATE tbl_informacion_biblioteca
    SET Mision = ?
  `,[mision]);

  return { success: true };
}


//ACTUALIZAR VISION
export const updateVision = async (vision) => {

  await db.query(`
    UPDATE tbl_informacion_biblioteca
    SET Vision = ?
  `,[vision]);

  return { success: true };
}


//ACTUALIZAR OBJETIVO
export const updateObjetivo = async (objetivo) => {

  await db.query(`
    UPDATE tbl_informacion_biblioteca
    SET Objetivo = ?
  `,[objetivo]);

  return { success: true };
}