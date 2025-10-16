const db = require('../Models');
const { Op } = require('sequelize');
const { flattenSalidasData } = require('../utils/flattenSalidasData.util.js');
const { generateCSV, generatePDF } = require('../utils/fileGenerator.util.js');
const path = require('path');

exports.generarReporteSalidas = async (reporteFiltros, departamento) => {
    const { fechaInicio, fechaFin, formato } = reporteFiltros;

    const tableHeaders = [
        'Fecha', 'Departamento', 'Producto', 'Categoría', 'Presentación', 'Cantidad',
        'Tipo Salida', 'Usuario Responsable', 'Rol Usuario', 'Notas'
    ];

    const whereClause = {
        fecha: { [Op.between]: [fechaInicio, fechaFin] },
        departamento: departamento ? { [Op.eq]: departamento } : undefined
    };

    const salidas = await db.Salidas.findAll({
        where: whereClause,
        include: [
            {
                model: db.TiposSalidas, attributes: ['Nombre'],
            },
            {
                model: db.Departamentos, attributes: ['Nombre'],
            },
            {
                model: db.Usuarios,
                attributes: ['NombreCompleto'],
                include: [{ model: db.Roles, attributes: ['Nombre'] }],

            },
            {
                model: db.Productos,
                attributes: ['Nombre', 'Presentacion'],
                include: [{ model: db.Categorias, attributes: ['Nombre'] }],

            }
        ],
        order: [['fecha', 'ASC']],
    });

    const flattenedData = flattenSalidasData(salidas);

    const metadata = {
        titulo: 'Reporte de Salidas del Inventario',
        generadoPor: req.user, // puedes tomarlo del req.user si tienes auth
        fechaGeneracion: new Date().toISOString(),
        periodo: { inicio: fechaInicio, fin: fechaFin },
        totales: {
            productosDistintos: [...new Set(flattenedData.map(d => d.Producto))].length,
            unidadesRetiradas: flattenedData.reduce((sum, d) => sum + d['Cantidad Total'], 0)
        }
    };

    const filename = `reporte_salidas_${Date.now()}.${formato === 'CSV' ? 'csv' : 'pdf'}`;
    const filePath = path.join('./reports', filename);

    if (formato === 'CSV') {
        await generateCSV(flattenedData, metadata, filePath);
    } else if (formato === 'PDF') {
        await generatePDF(flattenedData, metadata, tableHeaders, filePath);
    }

    return filePath;
};

module.exports = {
    generarReporteSalidas: exports.generarReporteSalidas,
};