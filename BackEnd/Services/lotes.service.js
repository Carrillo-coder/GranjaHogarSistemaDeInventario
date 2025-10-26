const db = require('../Models');
const { flattenLotesData } = require('../utils/flattenLotesData.util.js');
const { generateXLSX, generatePDF } = require('../utils/fileGenerator.util.js');
const Lote = db.Lote;
const Producto = db.Producto;
const Categoria = db.Categoria;

class LotesService {

    // GET /api/inventario/lotes/idproducto
    static async getLotesByIdProducto(idProducto) {
        try {
            const lotes = await Lote.findAll({
                where: { idProducto: idProducto, activo: true },
                include: [{
                    model: Producto,
                    as: 'producto',
                    attributes: ['idProducto', 'nombre', 'presentacion']
                }],
                order: [['caducidad', 'ASC']]
            });

            if (!lotes || lotes.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron lotes para ese producto',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Lotes obtenidos correctamente',
                data: lotes,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener lotes por producto',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // GET /api/inventario/lotes?producto="nombre"
    static async getLotesByNombreProducto(nombre) {
        try {
            const lotes = await Lote.findAll({
                include: [{
                    model: Producto,
                    as: 'producto',
                    where: { nombre: { [db.Sequelize.Op.like]: `%${nombre}%` } },
                    attributes: ['idProducto', 'nombre', 'presentacion']
                }],
                where: { activo: true },
                order: [['caducidad', 'ASC']]
            });

            if (!lotes || lotes.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron lotes para ese nombre de producto',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Lotes obtenidos correctamente',
                data: lotes,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener lotes por nombre de producto',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // NUEVO: GET /api/inventario/lotes/fechas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD

    static async getLotesByFecha(desde, hasta) {
        try {
            const Op = db.Sequelize.Op;

            // Normalizar inputs (si vienen vacíos)
            let desdeDate = desde ? new Date(desde) : null;
            let hastaDate = hasta ? new Date(hasta) : null;

            const whereClause = { activo: 1 };

            if (desdeDate && hastaDate) {
                // usamos objetos Date para evitar problemas de formato
                whereClause.caducidad = { [Op.between]: [desdeDate, hastaDate] };
            } else if (desdeDate) {
                whereClause.caducidad = { [Op.gte]: desdeDate };
            } else if (hastaDate) {
                whereClause.caducidad = { [Op.lte]: hastaDate };
            }

            //para depurar
            //console.log('[LoteService] getLotesByFecha -> whereClause:', JSON.stringify(whereClause));

            const lotes = await Lote.findAll({
                where: whereClause,
                include: [{
                    model: Producto,
                    as: 'producto',
                    // atributos según tu modelo Producto (usa nombres exactos)
                    attributes: ['idProducto', 'nombre', 'presentacion']
                }],
                order: [['caducidad', 'ASC']]
            });

            if (!lotes || lotes.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron lotes en el rango de fechas indicado',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Lotes obtenidos correctamente por fecha',
                data: lotes,
                statusCode: 200
            };
        } catch (error) {
            console.error('[LoteService] getLotesByFecha error:', error);
            return {
                success: false,
                message: 'Error al obtener lotes por fecha',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // POST /api/inventario/lotes
    static async createLote(data) {
    try {
        // Acepta ambos nombres, y sincroniza valores si uno falta
        let { cantidad, unidadesExistentes, caducidad, idProducto, idEntrada, activo } = data;

        // Requeridos mínimos (según tu tabla): idProducto e idEntrada siempre;
        // al menos uno de {cantidad, unidadesExistentes}; caducidad puede ser null.
        if (!idProducto || !idEntrada) {
        return { success: false, message: 'idProducto e idEntrada son obligatorios', statusCode: 400 };
        }

        // Normaliza números
        const cantNum = cantidad != null ? Number(cantidad) : null;
        const existNum = unidadesExistentes != null ? Number(unidadesExistentes) : null;

        // Si viene uno solo, úsalo para poblar el otro
        const finalCantidad = cantNum != null ? cantNum : existNum;
        const finalExistentes = existNum != null ? existNum : cantNum;

        if (finalCantidad == null || finalExistentes == null) {
        return { success: false, message: 'Debe enviarse cantidad o unidadesExistentes', statusCode: 400 };
        }
        if (finalCantidad < 0 || finalExistentes < 0) {
        return { success: false, message: 'Valores no pueden ser negativos', statusCode: 400 };
        }

        // caducidad: permite null (tu DDL lo permite)
        const finalCaducidad = caducidad ? new Date(caducidad) : null;
        if (caducidad && Number.isNaN(finalCaducidad.getTime())) {
        return { success: false, message: 'caducidad inválida (use YYYY-MM-DD)', statusCode: 400 };
        }

        // Validar existencia del producto (opcional: también la entrada)
        const productoExiste = await Producto.findByPk(idProducto);
        if (!productoExiste) {
        return { success: false, message: 'El producto asociado no existe', statusCode: 400 };
        }
        // Opcional: valida entrada si tienes el modelo:
        // const entradaExiste = await Entrada.findByPk(idEntrada);
        // if (!entradaExiste) { ... }

        // BIT/BOOLEAN: guarda 1 por defecto
        const finalActivo = (activo === 0 || activo === false) ? 0 : 1;

        const nuevoLote = await Lote.create({
        cantidad: finalCantidad,
        unidadesExistentes: finalExistentes,
        caducidad: finalCaducidad,   // puede ser null
        activo: finalActivo,
        idProducto,
        idEntrada
        });

        return {
        success: true,
        message: 'Lote creado correctamente',
        data: nuevoLote,
        statusCode: 201
        };
    } catch (error) {
        return {
        success: false,
        message: 'Error al crear lote',
        error: error.message,
        statusCode: 400
        };
    }
    }


    // GET /api/inventario/lotes/reporte?formato=CSV|PDF
    static async generarReporteLotes(formato) {
        const tableHeaders = [
            'No.', 'Producto', 'Categoría', 'Presentación', 'ID Lote',
            'Unidades Existentes', 'Caducidad', 'Total por Producto'
        ];

        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria, attributes: ['nombre'], as: 'categoria'
                },
                {
                    model: Lote,
                    attributes: ['idLotes', 'unidadesExistentes', 'caducidad', 'activo'],
                    as: 'lotes',
                }
            ],
            attributes: ['idProducto', 'nombre', 'presentacion'],
            order: [['nombre', 'ASC']],
        });
        const flattenedData = flattenLotesData(productos);

        const metadata = {
            titulo: 'Reporte General de Inventario',
            generadoPor: 'Rocio Rodriguez', // si tienes auth => req.user.nombreCompleto
            fechaGeneracion: new Date().toLocaleDateString(),
            totales: {
                productosDistintos: productos.length,
                unidadesTotales: flattenedData
                    .filter(d => d['Unidades Existentes'])
                    .reduce((sum, d) => sum + (Number(d['Unidades Existentes']) || 0), 0),
                registros: Math.ceil(flattenedData.length / 2)
            }
        };

        const filename = `reporte_inventario_${Date.now()}.${formato.toLowerCase()}`;
        let buffer;

        if (formato === 'XLSX') {
            buffer = await generateXLSX(flattenedData, metadata);
        } else if (formato === 'PDF') {
            buffer = await generatePDF(flattenedData, metadata, tableHeaders);
        }

        return { 
            success: true,
            message: 'Reporte de inventario generado correctamente',
            buffer: buffer, 
            filename: filename,
            statusCode: 200 
        };
    }
};

module.exports = LotesService;