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

    // ========= MEDIDAS GENERALES =========
    const marginX = 15;
    const topLineY = 38;
    const footerLineY = pageHeight - 38;

    const titleY = 50;
    const subtitleY = 72;

    const tableX = 15;
    const tableY = 100;
    const tableWidth = pageWidth - 30;

    // tamaños originales, como tu diseño
    const headerHeight = 20;
    const rowHeight = 18;
    const totalHeight = 20;

    // para hojas siguientes
    const continuationY = 62;

    const formatDate = (value) => {
      if (!value) return '';
      const fecha = new Date(value);
      if (isNaN(fecha)) return String(value).slice(0, 10);
      const y = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const drawTopLine = () => {
      doc
        .lineWidth(0.8)
        .strokeColor('black')
        .moveTo(marginX, topLineY)
        .lineTo(pageWidth - marginX, topLineY)
        .stroke();
    };

    const drawTopHeader = () => {
      drawTopLine();

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
        fontSize = 13,
        paddingX = 3,
        paddingY = 5
      } = options;

      doc
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(fontSize)
        .fillColor('black')
        .text(String(text ?? ''), x + paddingX, y + paddingY, {
          width: w - paddingX * 2,
          align,
          lineBreak: false,
          ellipsis: true
        });
    };

    const drawFooterRight = (pageNumber, totalPages) => {
      doc
        .lineWidth(0.8)
        .strokeColor('black')
        .moveTo(marginX, footerLineY)
        .lineTo(pageWidth - marginX, footerLineY)
        .stroke();

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('black')
        .text(`${pageNumber} / ${totalPages}`, pageWidth - 42, footerLineY + 8);
    };

    const drawSecondPageLabelTop = (pageNumber, totalPages) => {
      doc
        .font('Helvetica')
        .fontSize(5.5)
        .fillColor('black')
        .text(`Página ${pageNumber}/${totalPages}`, 0, 56, { align: 'center' });
    };

    const addContinuationPage = () => {
      doc.addPage({
        margin: 0,
        size: 'A4',
        layout: 'landscape'
      });

      drawTopLine();
    };

    // ==========================
    // MULTAS
    // ==========================
    if (tipo === 'multas') {
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

      const proportions = [0.12, 0.13, 0.13, 0.22, 0.10, 0.10, 0.10, 0.10];
      const colWidths = proportions.map(p => tableWidth * p);

      const drawHeaderRow = (x, y) => {
        let currentX = x;

        for (let i = 0; i < headers.length; i++) {
          drawRect(currentX, y, colWidths[i], headerHeight, '#d9d9d9');
          drawTextInCell(headers[i], currentX, y, colWidths[i], headerHeight, {
            bold: true,
            align: 'center',
            fontSize: 10,
            paddingX: 2,
            paddingY: 6
          });
          currentX += colWidths[i];
        }
      };

      const drawRow = (x, y, values) => {
        let currentX = x;

        for (let i = 0; i < values.length; i++) {
          drawRect(currentX, y, colWidths[i], rowHeight);

          let align = 'left';
          if (i >= 4 && i <= 6) align = 'center';
          if (i === 7) align = 'right';

          drawTextInCell(values[i], currentX, y, colWidths[i], rowHeight, {
            align,
            fontSize: 10,
            paddingX: 3,
            paddingY: 5
          });

          currentX += colWidths[i];
        }
      };

      const drawTotalRow = (x, y, total) => {
        const widthBeforeTotal =
          colWidths[0] +
          colWidths[1] +
          colWidths[2] +
          colWidths[3] +
          colWidths[4] +
          colWidths[5];

        drawRect(x, y, widthBeforeTotal, totalHeight, '#d9d9d9');
        drawRect(x + widthBeforeTotal, y, colWidths[6], totalHeight, '#d9d9d9');
        drawRect(x + widthBeforeTotal + colWidths[6], y, colWidths[7], totalHeight, '#d9d9d9');

        drawTextInCell('TOTAL:', x + widthBeforeTotal, y, colWidths[6], totalHeight, {
          bold: true,
          align: 'right',
          fontSize: 5.6,
          paddingX: 4,
          paddingY: 6
        });

        drawTextInCell(
          `$${Number(total).toFixed(2)}`,
          x + widthBeforeTotal + colWidths[6],
          y,
          colWidths[7],
          totalHeight,
          {
            bold: true,
            align: 'right',
            fontSize:10,
            paddingX: 4,
            paddingY: 6
          }
        );
      };

      drawTopHeader();
      drawHeaderRow(tableX, tableY);

      let currentY = tableY + headerHeight;
      let total = 0;

      for (const row of data) {
        total += Number(row.Monto || 0);

        // si la fila + total ya no caben, nueva hoja de continuación
        if (currentY + rowHeight + totalHeight > footerLineY - 8) {
          addContinuationPage();
          currentY = continuationY;
        }

        drawRow(tableX, currentY, [
          row.Nombre || '',
          row.Apellido_P || '',
          row.Apellido_M || '',
          row.Titulo || '',
          formatDate(row.Fecha_devolucion),
          formatDate(row.Fecha_devolucion_real),
          row.Dias_excedidos || '',
          row.Monto ? `$${Number(row.Monto).toFixed(2)}` : ''
        ]);

        currentY += rowHeight;
      }

      if (currentY + totalHeight > footerLineY - 8) {
        addContinuationPage();
        currentY = continuationY;
      }

      drawTotalRow(tableX, currentY, total);
    }

    // ==========================
    // PRESTAMOS
    // ==========================
    else {
      const headers = [
        'ID Usuario',
        'Nombre',
        'Apellido Paterno',
        'Apellido Materno',
        'ID Libro',
        'Título',
        'Fecha Préstamo',
        'Fecha Devolución',
        'Fecha Entrega'
      ];

      const proportions = [0.09, 0.09, 0.11, 0.11, 0.09, 0.20, 0.10, 0.10, 0.11];
      const colWidths = proportions.map(p => tableWidth * p);

      const drawHeaderRow = (x, y) => {
        let currentX = x;

        for (let i = 0; i < headers.length; i++) {
          drawRect(currentX, y, colWidths[i], headerHeight, '#d9d9d9');
          drawTextInCell(headers[i], currentX, y, colWidths[i], headerHeight, {
            bold: true,
            align: 'center',
            fontSize: 10,
            paddingX: 2,
            paddingY: 6
          });
          currentX += colWidths[i];
        }
      };

      const drawRow = (x, y, values) => {
        let currentX = x;

        for (let i = 0; i < values.length; i++) {
          drawRect(currentX, y, colWidths[i], rowHeight);

          let align = 'left';
          if (i === 0 || i === 4 || i >= 6) align = 'center';

          drawTextInCell(values[i], currentX, y, colWidths[i], rowHeight, {
            align,
            fontSize: 10,
            paddingX: 3,
            paddingY: 5
          });

          currentX += colWidths[i];
        }
      };

      drawTopHeader();
      drawHeaderRow(tableX, tableY);

      let currentY = tableY + headerHeight;

      for (const row of data) {
        // en hojas siguientes solo continúa la tabla, sin repetir encabezado
        if (currentY + rowHeight > footerLineY - 8) {
          addContinuationPage();
          currentY = continuationY;
        }

        drawRow(tableX, currentY, [
          row.Id || '',
          row.Nombre || '',
          row.Apellido_P || '',
          row.Apellido_M || '',
          row.Id_libro || '',
          row.Titulo || '',
          formatDate(row.Fecha_prestamo),
          formatDate(row.Fecha_devolucion),
          row.Fecha_devolucion_real ? formatDate(row.Fecha_devolucion_real) : 'No entregado'
        ]);

        currentY += rowHeight;
      }
    }

    // ==========================
    // NUMERACIÓN FINAL
    // ==========================
    const range = doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      drawFooterRight(i + 1, totalPages);

      if (i > 0) {
        drawSecondPageLabelTop(i + 1, totalPages);
      }
    }

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};