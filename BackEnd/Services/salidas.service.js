const db = require('../Models');
const { Op } = require('sequelize');
const { flattenSalidasData } = require('../utils/flattenSalidasData.util.js');
const { generateXLSX, generatePDF } = require('../utils/fileGenerator.util.js');

class SalidasService {
    static async generarReporteSalidas(reporteFiltros, departamento) {
        const { fechaInicio, fechaFin, formato } = reporteFiltros;

        const tableHeaders = [
            'No.', 'Fecha', 'Departamento', 'Producto', 'Categoría', 'Presentación', 'Cantidad Retirada',
            'Tipo Salida', 'Usuario Responsable', 'Rol Usuario', 'Notas'
        ];

        const salidas = await db.Salida.findAll({
            where: {
                fecha: { [Op.between]: [fechaInicio, fechaFin] }
            },
            include: [
                {
                    model: db.TipoSalida, attributes: ['nombre'],
                },
                {
                    model: db.Departamento,
                    attributes: ['nombre'],
                    where: departamento && departamento !== 'Todos' ? { nombre: departamento } : undefined
                },

                {
                    model: db.Usuario,
                    attributes: ['nombreCompleto'],
                    include: [{ model: db.Rol, attributes: ['nombre'] }],
                },
                {
                    model: db.Producto,
                    attributes: ['nombre', 'presentacion'],
                    include: [{ model: db.Categoria, attributes: ['nombre'], as: 'Categoria' }],
                }
            ],
            order: [['fecha', 'ASC']],
        });


        const flattenedData = flattenSalidasData(salidas);

        const metadata = {
            titulo: 'Reporte de Salidas del Inventario',
            generadoPor: 'usuario', // puedes tomarlo del req.user si tienes auth
            fechaGeneracion: new Date().toLocaleDateString(),
            periodo: { inicio: fechaInicio, fin: fechaFin },
            totales: {
                productosDistintos: [...new Set(flattenedData.map(d => d.Producto))].length,
                unidadesTotales: flattenedData.reduce((sum, d) => sum + (d['Cantidad Retirada'] ?? 0), 0),
                registros: flattenedData.length
            }
        };

        const filename = `reporte_salidas_${Date.now()}.${formato.toLowerCase()}`;
        let buffer;

        if (formato === 'XLSX') {
            buffer = await generateXLSX(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { buffer, filename };
    }
};

module.exports = SalidasService;