import { Parser } from 'json2csv';
import fs from 'fs';
import PDFDocument from 'pdfkit';

export async function generateCSV(flattenedData, metadata, filePath) {
    const parser = new Parser();
    const csvTabla = parser.parse(flattenedData);

    const unidadesLabel =
        metadata.totales.unidadesIngresadas !== undefined
            ? 'Unidades ingresadas'
            : 'Unidades totales';

    const metadataRows = [
        [metadata.titulo],
        ['Generado por:', metadata.generadoPor],
        ['Fecha de generación:', metadata.fechaGeneracion],
        ['Período:', `${metadata.periodo.inicio} - ${metadata.periodo.fin}`],
        ['Productos distintos:', metadata.totales.productosDistintos],
        [unidadesLabel + ':', metadata.totales.unidadesIngresadas ?? metadata.totales.unidadesTotales],
        [],
    ]
        .map((row) => row.join(','))
        .join('\n');

    const csv = `${metadataRows}\n${csvTabla}`;
    fs.writeFileSync(filePath, csv);
    return filePath;
};

export async function generatePDF(flattenedData, metadata, tableHeaders, filePath) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(14).text(metadata.titulo, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generado por: ${metadata.generadoPor}`);
    doc.text(`Fecha de generación: ${metadata.fechaGeneracion}`);
    doc.text(`Período: ${metadata.periodo.inicio} - ${metadata.periodo.fin}`);
    doc.text(`Productos distintos: ${metadata.totales.productosDistintos}`);

    const unidadesLabel =
        metadata.totales.unidadesIngresadas !== undefined
            ? 'Unidades ingresadas'
            : 'Unidades totales';

    doc.text(`${unidadesLabel}: ${metadata.totales.unidadesIngresadas ?? metadata.totales.unidadesTotales}`);
    doc.moveDown(1);

    doc.fontSize(8);
    tableHeaders.forEach(header => doc.text(header, { continued: true, width: 65, align: 'left' }));
    doc.moveDown(0.5);

    flattenedData.forEach(row => {
        tableHeaders.forEach(field => doc.text(String(row[field] || ''), { continued: true, width: 65, align: 'left' }));
        doc.moveDown(0.5);
    });

    doc.end();
    return filePath;
};