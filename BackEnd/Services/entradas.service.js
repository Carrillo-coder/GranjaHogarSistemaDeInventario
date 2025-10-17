const db = require('../Models');
const { Op } = require('sequelize');
const { flattenEntradasData } = require('../utils/flattenEntradasData.util.js');
const { generateCSV, generatePDF } = require('../utils/fileGenerator.util.js');

class EntradasService {
    static async generarReporteEntradas(reporteFiltros) {
        const { fechaInicio, fechaFin, formato } = reporteFiltros;

        const tableHeaders = [
            'No.', 'Fecha', 'Producto', 'Categoria', 'Presentacion', 'Cantidad Total',
            'Lote', 'Unidades Restantes', 'Caducidad', 'Activo', 'Proveedor',
            'Tipo Entrada', 'Usuario Responsable', 'Rol Usuario', 'Notas'
        ];

        const whereClause = {
            fecha: { [Op.between]: [fechaInicio, fechaFin] }
        };

        const entradas = await db.Entrada.findAll({
            where: whereClause,
            include: [
                {
                    model: db.TipoEntrada, attributes: ['nombre'],
                },
                {
                    model: db.Usuario,
                    attributes: ['nombreCompleto'],
                    include: [{ model: db.Rol, attributes: ['nombre'] }],
                },
                {
                    model: db.Lote,
                    attributes: ['idLotes', 'cantidad', 'unidadesExistentes', 'caducidad', 'activo'], 
                    include: [
                        {
                            model: db.Producto,
                            attributes: ['nombre', 'presentacion'],
                            include: [{ model: db.Categoria, attributes: ['nombre'], as: 'Categoria' }],
                        },
                    ],
                },
            ],
            order: [['fecha', 'ASC']],
        });

        const flattenedData = flattenEntradasData(entradas);

        const metadata = {
            titulo: 'Reporte de Entradas al Inventario',
            generadoPor: 'usuario', // puedes tomarlo del req.user si tienes auth
            fechaGeneracion: new Date().toLocaleString(),
            periodo: { inicio: fechaInicio, fin: fechaFin },
            totales: {
                productosDistintos: [...new Set(flattenedData.map(d => d.Producto))].length,
                unidadesTotales: flattenedData.reduce((sum, d) => sum + (d['Cantidad Total'] ?? 0), 0),
                registros: flattenedData.length
            }
        };

        const filename = `reporte_entradas_${Date.now()}.${formato.toLowerCase()}`;
        let buffer;
        if (formato === 'CSV') {
            buffer = await generateCSV(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { buffer, filename };
    }
};

module.exports = EntradasService;