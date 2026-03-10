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

    let data = [];

    if (tipo === 'multas') {
      data = await reportesModel.getReporteMultas(inicio, fin);
    } else {
      data = await reportesModel.getReportePrestamos(inicio, fin);
    }

    const doc = new PDFDocument({
      margin: 0,
      size: 'A4',
      layout: 'landscape',
      bufferPages: true
    });

    const nombreArchivo = `reporte_${tipo}_${inicio}_${fin}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // MEDIDAS GENERALES
    const topLineY = 22;
    const footerLineY = pageHeight - 60;

    // MÁS ESPACIO ARRIBA DEL TÍTULO
    const titleY = 42;
    const subtitleY = 63;

    // TABLA MÁS PAREJA COMO TU MODELO
    const tableX = 15;
    const tableY = 102;

    const headerHeight = 18;
    const rowHeight = 18;
    const totalHeight = 18;

    // ANCHOS AJUSTADOS PARA QUE QUEDE PAREJA
    const colWidths = [60, 72, 72, 112, 58, 58, 52, 48];
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);

    const headers = [
      'Usuario',
      'Apellido Paterno',
      'Apellido Materno',
      'Título del Libro',
      'Fecha Devolución',
      'Fecha Entrega',
      'Días Excedidos',
      'Monto'
    ];

    const formatDate = (value) => {
      if (!value) return '';
      const fecha = new Date(value);
      if (isNaN(fecha)) return String(value).slice(0, 10);
      const y = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const drawTopHeader = () => {
      doc
        .lineWidth(0.8)
        .strokeColor('black')
        .moveTo(15, topLineY)
        .lineTo(pageWidth - 15, topLineY)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(10.5)
        .fillColor('black')
        .text(
          tipo === 'multas' ? 'Reporte de Multas' : 'Reporte de Préstamos',
          0,
          titleY,
          { align: 'center' }
        );

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('black')
        .text(`Del ${inicio} al ${fin}`, 0, subtitleY, { align: 'center' });
    };

    const drawRect = (x, y, w, h, fillColor = null) => {
      if (fillColor) {
        doc.save();
        doc.fillColor(fillColor).rect(x, y, w, h).fill();
        doc.restore();
      }

      doc
        .lineWidth(0.6)
        .strokeColor('black')
        .rect(x, y, w, h)
        .stroke();
    };

    const drawTextInCell = (text, x, y, w, h, options = {}) => {
      const {
        bold = false,
        align = 'left',
        fontSize = 5.2,
        paddingX = 2,
        paddingY = 5
      } = options;

      doc
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(fontSize)
        .fillColor('black')
        .text(String(text ?? ''), x + paddingX, y + paddingY, {
          width: w - paddingX * 2,
          align
        });
    };

    const drawHeaderRow = (x, y) => {
      let currentX = x;

      for (let i = 0; i < headers.length; i++) {
        drawRect(currentX, y, colWidths[i], headerHeight, '#d9d9d9');
        drawTextInCell(headers[i], currentX, y, colWidths[i], headerHeight, {
          bold: true,
          align: 'center',
          fontSize: 5.1,
          paddingX: 1,
          paddingY: 5
        });
        currentX += colWidths[i];
      }
    };

    const drawRow = (x, y, values) => {
      let currentX = x;

      for (let i = 0; i < values.length; i++) {
        drawRect(currentX, y, colWidths[i], rowHeight, null);

        let align = 'left';
        if (i === 4 || i === 5 || i === 6) align = 'center';
        if (i === 7) align = 'right';

        drawTextInCell(values[i], currentX, y, colWidths[i], rowHeight, {
          bold: false,
          align,
          fontSize: 5.0,
          paddingX: 2,
          paddingY: 5
        });

        currentX += colWidths[i];
      }
    };

    const drawTotalRow = (x, y, total) => {
      const firstPartWidth =
        colWidths[0] +
        colWidths[1] +
        colWidths[2] +
        colWidths[3] +
        colWidths[4] +
        colWidths[5];

      drawRect(x, y, firstPartWidth, totalHeight, '#d9d9d9');
      drawRect(x + firstPartWidth, y, colWidths[6], totalHeight, '#d9d9d9');
      drawRect(x + firstPartWidth + colWidths[6], y, colWidths[7], totalHeight, '#d9d9d9');

      drawTextInCell('TOTAL:', x + firstPartWidth, y, colWidths[6], totalHeight, {
        bold: true,
        align: 'right',
        fontSize: 5.6,
        paddingX: 3,
        paddingY: 5
      });

      drawTextInCell(`$${Number(total).toFixed(2)}`, x + firstPartWidth + colWidths[6], y, colWidths[7], totalHeight, {
        bold: true,
        align: 'right',
        fontSize: 5.6,
        paddingX: 3,
        paddingY: 5
      });
    };

    const drawFooter = (pageNumber, totalPages, showCenterText = false) => {
      doc
        .lineWidth(0.8)
        .strokeColor('black')
        .moveTo(15, footerLineY)
        .lineTo(pageWidth - 15, footerLineY)
        .stroke();

      if (showCenterText) {
        doc
          .font('Helvetica')
          .fontSize(5.2)
          .fillColor('black')
          .text(`Página ${pageNumber}/${totalPages}`, 0, footerLineY + 14, {
            align: 'center'
          });
      }

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('black')
        .text(`${pageNumber} / ${totalPages}`, pageWidth - 42, footerLineY + 8);
    };

    // DATOS
    if (tipo === 'multas') {
      let total = 0;

      const rows = data.map(row => {
        total += Number(row.Monto || 0);

        return [
          row.Nombre || '',
          row.Apellido_P || '',
          row.Apellido_M || '',
          row.Titulo || '',
          formatDate(row.Fecha_devolucion),
          formatDate(row.Fecha_devolucion_real),
          row.Dias_excedidos || '',
          row.Monto ? `$${Number(row.Monto).toFixed(2)}` : ''
        ];
      });

      drawTopHeader();
      drawHeaderRow(tableX, tableY);

      let currentY = tableY + headerHeight;

      for (const rowValues of rows) {
        drawRow(tableX, currentY, rowValues);
        currentY += rowHeight;
      }

      drawTotalRow(tableX, currentY, total);

    } else {
      // SI LUEGO QUIERES, AQUÍ TE ADAPTO PRÉSTAMOS EXACTAMENTE IGUAL
      drawTopHeader();
      drawHeaderRow(tableX, tableY);

      let currentY = tableY + headerHeight;

      const rows = data.map(row => [
        row.Nombre || '',
        row.Apellido_P || '',
        row.Apellido_M || '',
        row.Titulo || '',
        formatDate(row.Fecha_devolucion),
        formatDate(row.Fecha_devolucion_real),
        '',
        ''
      ]);

      for (const rowValues of rows) {
        drawRow(tableX, currentY, rowValues);
        currentY += rowHeight;
      }

      drawTotalRow(tableX, currentY, 0);
    }

    // SEGUNDA HOJA FIJA
    doc.addPage({
      margin: 0,
      size: 'A4',
      layout: 'landscape'
    });

    doc
      .lineWidth(0.8)
      .strokeColor('black')
      .moveTo(15, topLineY)
      .lineTo(pageWidth - 15, topLineY)
      .stroke();

    // FOOTERS
    const range = doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      if (i === 0) {
        drawFooter(i + 1, totalPages, false);
      } else {
        drawFooter(i + 1, totalPages, true);
      }
    }

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};