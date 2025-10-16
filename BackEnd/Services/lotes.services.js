const db = require('../Models');
const { flattenLotesData } = require('../utils/flattenLotesData.util.js');
const { generateCSV, generatePDF } = require('../utils/fileGenerator.util.js');
const path = require('path');


exports.generarReporteLotes = async (formato) => {
    const tableHeaders = [
        'Producto', 'Categoría', 'Presentación', 'ID Lote',
        'Unidades Existentes', 'Caducidad', 'Activo', 'Total por Producto'
    ];

    const whereClause = { activo: true };
    const productos = await db.Productos.findAll({
        include: [
            {
                model: db.Lotes,
                where: whereClause,
                required: false,
                attributes: ['idLote', 'UnidadesExistentes', 'Caducidad', 'Activo'],
            },
            {
                model: db.Categorias,
                attributes: ['Nombre'],
            },
        ],
        order: [
            ['Nombre', 'ASC'],
            [db.Lotes, 'Caducidad', 'ASC'],
        ],
    });

    const flattenedData = flattenLotesData(productos);

    const metadata = {
        titulo: 'Reporte General de Inventario',
        generadoPor: 'Sistema de Inventario', // si tienes auth => req.user.nombreCompleto
        fechaGeneracion: new Date().toISOString(),
        periodo: { inicio: fechaInicio || 'N/A', fin: fechaFin || 'N/A' },
        totales: {
            productosDistintos: new Set(flattenedData.map(d => d.Producto)).size,
            unidadesTotales: flattenedData
                .filter(d => d['Unidades Existentes'])
                .reduce((sum, d) => sum + (Number(d['Unidades Existentes']) || 0), 0)
        }
    };

    const filename = `reporte_inventario_${Date.now()}.${formato === 'CSV' ? 'csv' : 'pdf'}`;
    const filePath = path.join('./reports', filename);

    if (formato === 'CSV') {
        await generateCSV(flattenedData, metadata, filePath);
    } else if (formato === 'PDF') {
        await generatePDF(flattenedData, metadata, tableHeaders, filePath);
    }

    return filePath;
};

module.exports = {
    generarReporteLotes: exports.generarReporteLotes,
};
