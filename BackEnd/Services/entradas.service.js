const db = require('../Models');
const { Op } = require('sequelize');
const { flattenEntradasData } = require('../utils/flattenEntradasData.util.js');
const { generateCSV, generatePDF } = require('../utils/fileGenerator.util.js');
const path = require('path');

class EntradasService {
    static async generarReporteEntradas(reporteFiltros) {
        const { fechaInicio, fechaFin, formato } = reporteFiltros;

        const tableHeaders = [
            'Fecha', 'Producto', 'Categoría', 'Presentación', 'Cantidad Ingresada',
            'Lote', 'Unidades Restantes', 'Caducidad', 'Activo', 'Proveedor',
            'Tipo Entrada', 'Usuario Responsable', 'Rol Usuario', 'Notas'
        ];

        const whereClause = {
            fecha: { [Op.between]: [fechaInicio, fechaFin] }
        };

        const entradas = await db.Entradas.findAll({
            where: whereClause,
            include: [
                {
                    model: db.TiposEntradas, attributes: ['Nombre'],
                },
                {
                    model: db.Usuarios,
                    attributes: ['NombreCompleto'],
                    include: [{ model: db.Roles, attributes: ['Nombre'] }],

                },
                {
                    model: db.Lotes,
                    attributes: ['idLote', 'unidadesExistentes', 'Caducidad', 'Activo'],
                    include: [
                        {
                            model: db.Productos,
                            attributes: ['Nombre', 'Presentacion'],
                            include: [{ model: db.Categorias, attributes: ['Nombre'] }],

                        },
                    ],
                },
            ],
            order: [['fecha', 'ASC']],
        });

        const flattenedData = flattenEntradasData(entradas);

        const metadata = {
            titulo: 'Reporte de Entradas al Inventario',
            generadoPor: req.user.nombreCompleto, // puedes tomarlo del req.user si tienes auth
            fechaGeneracion: new Date().toISOString(),
            periodo: { inicio: fechaInicio, fin: fechaFin },
            totales: {
                productosDistintos: [...new Set(flattenedData.map(d => d.Producto))].length,
                unidadesIngresadas: flattenedData.reduce((sum, d) => sum + d['Cantidad Total'], 0)
            }
        };

        const filename = `reporte_entradas_${Date.now()}.${formato === 'CSV' ? 'csv' : 'pdf'}`;
        const filePath = path.join('./reports', filename);

        if (formato === 'CSV') {
            await generateCSV(flattenedData, metadata, filePath);
        } else if (formato === 'PDF') {
            await generatePDF(flattenedData, metadata, tableHeaders, filePath);
        }

        return filePath;
    }
};


module.exports = EntradasService