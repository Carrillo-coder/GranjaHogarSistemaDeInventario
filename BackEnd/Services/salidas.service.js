const db = require('../Models');
const { Op, where } = require('sequelize');
const { flattenSalidasData } = require('../utils/flattenSalidasData.util.js');
const { generateCSV, generatePDF } = require('../utils/fileGenerator.util.js');

class SalidasService {

    static async getAllSalidas() {
        try {
            const salidas = await db.Salida.findAll();
            return {
                success: true,
                message: 'Salidas obtenidas correctamente',
                data: salidas,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener salidas',
                error: error.message,
                statusCode: 500
            };
        }
    }

    static async getSalidaById(id) {
        try {
            const salida = await db.Salida.findByPk(id);
            if (!salida) {
                return {
                    success: false,
                    message: 'Salida no encontrada',
                    data: null,
                    statusCode: 404
                };
            }
            return {
                success: true,
                message: 'Salida encontrada',
                data: salida,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener salida por ID',
                error: error.message,
                statusCode: 500
            };
        }
    }

    static async createSalida(data) {
        try {
            const nuevaSalida = await db.Salida.create(data);
            return {
                success: true,
                message: 'Salida creada correctamente',
                data: nuevaSalida,
                statusCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear salida',
                error: error.message,
                statusCode: 400
            };
        }
    }

    static async generarReporteSalidas(reporteFiltros, departamento) {
        const { fechaInicio, fechaFin, formato } = reporteFiltros;
        console.log({ fechaInicio, fechaFin, formato, departamento });

        const tableHeaders = [
            'No.', 'Fecha', 'Departamento', 'Producto', 'Categoría', 'Presentación', 'Cantidad Retirada',
            'Tipo Salida', 'Usuario Responsable', 'Rol Usuario', 'Notas'
        ];

        const departamentoWhere = (departamento && departamento !== 'Todos')
            ? { nombre: departamento }
            : undefined;

        const salidas = await db.Salida.findAll({
            where: {
                fecha: { [db.Sequelize.Op.between]: [fechaInicio, fechaFin] }
            },
            include: [
                {
                    model: db.TipoSalida,
                    attributes: ['nombre'],
                    as: 'tipoSalida'
                },
                {
                    model: db.Departamento,
                    attributes: ['nombre'],
                    where: departamentoWhere,
                    as: 'departamento'
                },
                {
                    model: db.Usuario,
                    attributes: ['nombreCompleto'],
                    as: 'usuario',
                    include: [{ model: db.Rol, attributes: ['nombre'], as: 'rol' }]
                },
                {
                    model: db.Producto,
                    attributes: ['nombre', 'presentacion'],
                    as: 'producto',
                    include: [{ model: db.Categoria, attributes: ['nombre'], as: 'categoria' }]
                }
            ],
            order: [['fecha', 'ASC']],

        });

        if (salidas.length === 0) {
            throw new Error(`No se encontraron salidas para el departamento "${departamento}" en el rango de fechas dado.`);
        }


        const flattenedData = flattenSalidasData(salidas);

        const metadata = {
            titulo: 'Reporte de Salidas del Inventario',
            generadoPor: 'usuario',
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

        if (formato === 'CSV') {
            buffer = await generateCSV(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { buffer, filename };
    }
};

module.exports = SalidasService;