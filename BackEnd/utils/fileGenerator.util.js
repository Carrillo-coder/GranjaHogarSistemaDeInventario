import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import ExcelJS from 'exceljs';

/**
 * Genera un Excel a partir de flattenedData y metadata
 * @param {Array} flattenedData - Datos ya aplanados para exportar
 * @param {Object} metadata - Información adicional del reporte
 * @param {Buffer} - Buffer del archivo XLSX generado
 */
export async function generateXLSX(flattenedData, metadata) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    worksheet.addRow([metadata.titulo] || 'Reporte').font = { size: 16, bold: true };
    worksheet.addRow(['Generado por:', metadata.generadoPor] || []).font = { size: 12, bold: false };
    worksheet.addRow(['Fecha de generación:', metadata.fechaGeneracion] || []).font = { size: 12, bold: false };
    if (metadata.periodo) {
        worksheet.addRow(['Período:', metadata.periodo.inicio, metadata.periodo.fin] || []).font = { size: 12, bold: false };
    }
    worksheet.addRow(['Productos distintos:', metadata.totales.productosDistintos ?? 0] || []).font = { size: 12, bold: false };
    worksheet.addRow(['Unidades totales:', metadata.totales.unidadesTotales ?? 0] || []).font = { size: 12, bold: false };
    worksheet.addRow(['Registros:', metadata.totales.registros ?? 0] || []).font = { size: 12, bold: false };
    worksheet.addRow([]);

    const headers = Object.keys(flattenedData[0]);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    flattenedData.forEach((dataRow) => {
        const rowValues = headers.map(h => dataRow[h]);
        const row = worksheet.addRow(rowValues);
        const totalRow = rowValues.some(v => typeof v === 'string' && v.trim().toUpperCase() === 'TOTAL');
        if (!totalRow) {
            row.eachCell((cell) => {
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
            });
        } else {
            row.font = { bold: true };
        }
    });
    worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, cell => {
            const len = cell.value ? cell.value.toString().length : 0;
            if (len > maxLength) maxLength = len;
        });
        column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * Genera un PDF con tabla a partir de flattenedData y metadata
 * @param {Array} flattenedData - Datos aplanados para exportar
 * @param {Object} metadata - Información del reporte
 * @param {Array} tableHeaders - Encabezados de la tabla
 * @returns {Promise<Buffer>} - Buffer del archivo PDF generado
 */
export async function generatePDF(flattenedData, metadata, tableHeaders) {

    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
            const stream = new PassThrough();
            const chunks = [];

            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', (err) => reject(err));

            doc.pipe(stream);

            doc.fontSize(14).text(metadata.titulo, { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(10).text(`Generado por: ${metadata.generadoPor}`);
            doc.text(`Fecha de generación: ${metadata.fechaGeneracion}`);
            if (metadata.periodo && metadata.periodo.inicio && metadata.periodo.fin) {
                doc.text(`Período: ${metadata.periodo.inicio} - ${metadata.periodo.fin}`);
            }
            doc.text(`Productos distintos: ${metadata.totales.productosDistintos ?? 0}`);
            doc.text(`Unidades totales: ${metadata.totales.unidadesTotales ?? 0}`);
            doc.text(`Registros: ${metadata.totales.registros ?? 0}`);
            doc.moveDown(1);


            const startX = doc.page.margins.left;
            let startY = doc.y;
            const columnCount = tableHeaders.length;
            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
            const cellWidth = pageWidth / columnCount;

            const drawHeaders = () => {
                const headerHeight = 25;
                doc.font('Helvetica-Bold').fontSize(8);
                tableHeaders.forEach((header, i) => {
                    doc.rect(startX + i * cellWidth, startY, cellWidth, headerHeight).stroke();
                    const textHeight = doc.heightOfString(header, { width: cellWidth - 4 });
                    const textY = startY + (headerHeight - textHeight) / 2;
                    doc.text(header, startX + i * cellWidth + 2, textY, {
                        width: cellWidth - 4,
                        align: 'center',
                    });
                });
                startY += headerHeight;
                doc.font('Helvetica').fontSize(8);
            };

            drawHeaders();

            flattenedData.forEach((row) => {
                const heights = tableHeaders.map((field) =>
                    doc.heightOfString(String(row[field] ?? ''), { width: cellWidth - 4 })
                );
                const rowHeight = Math.max(...heights) + 10;

                if (startY + rowHeight > doc.page.height - doc.page.margins.bottom) {
                    doc.addPage({ layout: 'landscape' });
                    startY = doc.page.margins.top;
                    drawHeaders();
                }

                tableHeaders.forEach((field, i) => {
                    doc.rect(startX + i * cellWidth, startY, cellWidth, rowHeight).stroke();
                    const textHeight = doc.heightOfString(String(row[field] ?? ''), { width: cellWidth - 4 });
                    const textY = startY + (rowHeight - textHeight) / 2;
                    doc.text(String(row[field] ?? ''), startX + i * cellWidth + 2, textY, {
                        width: cellWidth - 4,
                        align: 'center',
                    });
                });

                startY += rowHeight;
            });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });

}