import PDFDocument from 'pdfkit-table';
import * as reportesModel from '../models/reportes.models.js';

// DASHBOARD 

export const getDashboardStats = async (req, res) => {

  try {

    const stats = await reportesModel.getDashboardStats();

    res.status(200).json(stats);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// REPORTE JSON (TABLA NORMAL)

export const getReporte = async (req, res) => {

  try {

    const { tipo, inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({
        error: "Debe enviar fecha inicio y fecha fin"
      });
    }

    let data;

    if (tipo === 'multas') {

      data = await reportesModel.getReporteMultas(inicio, fin);

    } else {

      data = await reportesModel.getReportePrestamos(inicio, fin);

    }

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

// GENERAR PDF

export const generarPDF = async (req, res) => {

  try {

    const { tipo, inicio, fin } = req.query;

    let data;

    if (tipo === "multas") {
      data = await reportesModel.getReporteMultas(inicio, fin);
    } else {
      data = await reportesModel.getReportePrestamos(inicio, fin);
    }

    const doc = new PDFDocument({
      margin: 20,
      size: "A4",
      layout: "landscape"
    });

    const nombreArchivo = `reporte_${tipo}_${inicio}_${fin}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

    doc.pipe(res);

    // LINEA SUPERIOR

    doc.moveTo(20, 20)
       .lineTo(800, 20)
       .stroke();

    // TITULO

    doc.font("Helvetica-Bold")
       .fontSize(12)
       .text(
        tipo === "multas" ? "Reporte de Multas" : "Reporte de Préstamos",
        0,
        35,
        { align: "center" }
       );

    //SUBTITULO 

    doc.font("Helvetica")
       .fontSize(9)
       .text(
        `Del ${inicio} al ${fin}`,
        0,
        50,
        { align: "center" }
       );

    doc.moveDown(3);

    // TABLA 

    let table;

    if (tipo === "multas") {

      let total = 0;

      const rows = data.map(row => {

        total += Number(row.Monto || 0);

        return {
          usuario: row.Nombre || "",
          apP: row.Apellido_P || "",
          apM: row.Apellido_M || "",
          titulo: row.Titulo || "",
          devolucion: row.Fecha_devolucion || "",
          entrega: row.Fecha_devolucion_real || "",
          dias: row.Dias_excedidos || "",
          monto: `$${Number(row.Monto || 0).toFixed(2)}`
        };

      });

      rows.push({
        usuario: "",
        apP: "",
        apM: "",
        titulo: "",
        devolucion: "",
        entrega: "",
        dias: "TOTAL",
        monto: `$${total.toFixed(2)}`
      });

      table = {

        headers: [
          { label: "Usuario", property: "usuario", width: 80 },
          { label: "Apellido Paterno", property: "apP", width: 90 },
          { label: "Apellido Materno", property: "apM", width: 90 },
          { label: "Titulo del Libro", property: "titulo", width: 140 },
          { label: "Fecha Devolución", property: "devolucion", width: 90 },
          { label: "Fecha Entrega", property: "entrega", width: 90 },
          { label: "Dias Excedidos", property: "dias", width: 80 },
          { label: "Monto", property: "monto", width: 60 }

        ],

        datas: rows

      };

    } else {

      const rows = data.map(row => ({

        id: row.Id || "",
        nombre: row.Nombre || "",
        apP: row.Apellido_P || "",
        apM: row.Apellido_M || "",
        libro: row.Id_libro || "",
        titulo: row.Titulo || "",
        prestamo: row.Fecha_prestamo || "",
        devolucion: row.Fecha_devolucion || "",
        entrega: row.Fecha_devolucion_real || "Pendiente"

      }));

      table = {

        headers: [
          { label: "ID", property: "id", width: 50 },
          { label: "Nombre", property: "nombre", width: 80 },
          { label: "Apellido Paterno", property: "apP", width: 90 },
          { label: "Apellido Materno", property: "apM", width: 90 },
          { label: "ID Libro", property: "libro", width: 60 },
          { label: "Titulo", property: "titulo", width: 120 },
          { label: "Fecha Prestamo", property: "prestamo", width: 90 },
          { label: "Fecha Devolución", property: "devolucion", width: 90 },
          { label: "Entrega", property: "entrega", width: 90 }
        ],

        datas: rows

      };

    }

    await doc.table(table, {
      x: 20,
      y: 90
    });

    // LINEA INFERIOR

    doc.moveTo(20, 550)
       .lineTo(800, 550)
       .stroke();

    // PAGINA

    doc.fontSize(8)
       .text("1 / 1", 760, 555);

    doc.end();

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: error.message });

  }

};