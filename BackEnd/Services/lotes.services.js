const db = require('../Models');
const { flattenLotesData } = require('../utils/flattenLotesData.util.js');
const { generateXLSX, generatePDF } = require('../utils/fileGenerator.util.js');

class LotesService {
    static async generarReporteLotes(formato) {
        const tableHeaders = [
            'No.', 'Producto', 'Categoría', 'Presentación', 'ID Lote',
            'Unidades Existentes', 'Caducidad', 'Total por Producto'
        ];

        const productos = await db.Producto.findAll({
            include: [
                {
                    model: db.Categoria, attributes: ['nombre'], as: 'Categoria'
                },
                {
                    model: db.Lote,
                    attributes: [ 'idLotes', 'unidadesExistentes', 'caducidad', 'activo' ]
                }
            ],
            attributes: ['idProducto', 'nombre', 'presentacion'],
            order: [['nombre', 'ASC']],
        });

        const flattenedData = flattenLotesData(productos);

        const metadata = {
            titulo: 'Reporte General de Inventario',
            generadoPor: 'usuario', // si tienes auth => req.user.nombreCompleto
            fechaGeneracion: new Date().toLocaleDateString(),
            totales: {
                productosDistintos: productos.length,
                unidadesTotales: flattenedData
                    .filter(d => d['Unidades Existentes'])
                    .reduce((sum, d) => sum + (Number(d['Unidades Existentes']) || 0), 0),
                registros: flattenedData.length / 2
            }
        };

        const filename = `reporte_inventario_${Date.now()}.${formato.toLowerCase()}`;
        let buffer;

        if (formato === 'XLSX') {
            buffer = await generateXLSX(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { buffer, filename };
    }
};

module.exports = LotesService;

