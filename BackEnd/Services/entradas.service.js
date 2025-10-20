const db = require('../Models');
const { Op } = require('sequelize');
const { flattenEntradasData } = require('../utils/flattenEntradasData.util.js');
const { generateXLSX, generatePDF } = require('../utils/fileGenerator.util.js');

class EntradasService {

    static async createEntrada(data) {
        try {
            const nuevaEntrada = await db.Entrada.create(data);
            return {
                success: true,
                message: 'Entrada creada correctamente',
                data: nuevaEntrada,
                statusCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear entrada',
                error: error.message,
                statusCode: 400
            };
        }
    }
    static async getTipos() {
        try {
            const tipos = await db.Entrada.findAll({
                attributes: ['idTipo'],
                group: ['idTipo'],
                order: [['idTipo', 'ASC']]
            });

            const tiposList = tipos.map(t => t.idTipo);

            if (!tiposList || tiposList.length === 0) {
                return {
                    success: false,
                    message: 'No hay tipos de entrada disponibles',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Tipos obtenidos correctamente',
                data: tiposList,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener tipos de entrada',
                error: error.message,
                statusCode: 400
            };
        }
    }

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
                    model: db.TipoEntrada, 
                    attributes: ['nombre'],
                    as: 'tipoEntrada' // Alias actualizado
                },
                {
                    model: db.Usuario,
                    attributes: ['nombreCompleto'],
                    as: 'usuario', // Alias actualizado
                    include: [{ model: db.Rol, attributes: ['nombre'], as: 'rol' }], // Alias actualizado
                },
                {
                    model: db.Lote,
                    as: 'lotes', // Alias actualizado
                    attributes: ['idLotes', 'cantidad', 'unidadesExistentes', 'caducidad', 'activo'], 
                    include: [
                        {
                            model: db.Producto,
                            attributes: ['nombre', 'presentacion'],
                            as: 'producto', // Alias actualizado
                            include: [{ model: db.Categoria, attributes: ['nombre'], as: 'categoria' }], // Alias actualizado
                        },
                    ],
                },
            ],
            order: [['fecha', 'ASC']],
        });
        if (entradas.length === 0) {
            throw new Error(`No se encontraron entradas para el rango de fechas dado.`);
        }

        const flattenedData = flattenEntradasData(entradas);

        const metadata = {
            titulo: 'Reporte de Entradas al Inventario',
            generadoPor: 'usuario', 
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
        if (formato === 'XLSX') {
            buffer = await generateXLSX(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { buffer, filename };
    }
};

module.exports = EntradasService;