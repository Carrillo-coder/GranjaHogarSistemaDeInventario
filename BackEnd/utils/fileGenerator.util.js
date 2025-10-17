import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import { PassThrough } from 'stream';
import { get } from 'http';

/**
 * Genera un CSV a partir de flattenedData y metadata
 * @param {Array} flattenedData - Datos ya aplanados para exportar
 * @param {Object} metadata - Información adicional del reporte
 * @param {string} filePath - Ruta donde guardar el CSV
 * @returns {string} - Ruta del archivo generado
 */
export async function generateCSV(flattenedData, metadata) {

    const metadataRows = [
        [metadata.titulo],
        ['Generado por:', metadata.generadoPor],
        ['Fecha de generación:', metadata.fechaGeneracion],
        metadata.periodo
            ? ['Periodo:', `${metadata.periodo.inicio}`, `${metadata.periodo.fin}`]
            : [],
        ['Productos distintos:', metadata.totales.productosDistintos],
        ['Unidades totales:', metadata.totales.unidadesTotales ?? 0],
        ['Registros:', metadata.totales.registros ?? 0],
        [],
    ]
        .filter(row => row.length > 0)
        .map(row => row.join(','))
        .join('\n');

    const parser = new Parser({ fields: Object.keys(flattenedData[0]) });
    const csvTabla = parser.parse(flattenedData);
    const csv = `${metadataRows}\n${csvTabla}`;

    return Buffer.from('\uFEFF' + csv, 'utf8');
}

/**
 * Genera un PDF con tabla a partir de flattenedData y metadata
 * @param {Array} flattenedData - Datos aplanados para exportar
 * @param {Object} metadata - Información del reporte
 * @param {Array} tableHeaders - Encabezados de la tabla
 * @param {string} filePath - Ruta donde guardar el PDF
 * @returns {Promise<string>} - Ruta del archivo generado
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