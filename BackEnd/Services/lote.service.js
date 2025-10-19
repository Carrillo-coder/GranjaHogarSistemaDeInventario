const db = require('../Models');
const Lote = db.Lote;
const Producto = db.Producto;

class LoteService {

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

        const whereClause = {Activo: 1};

        if (desdeDate && hastaDate) {
            // usamos objetos Date para evitar problemas de formato
            whereClause.Caducidad = { [Op.between]: [desdeDate, hastaDate] };
        } else if (desdeDate) {
            whereClause.Caducidad = { [Op.gte]: desdeDate };
        } else if (hastaDate) {
            whereClause.Caducidad = { [Op.lte]: hastaDate };
        }

        //para depurar
        //console.log('[LoteService] getLotesByFecha -> whereClause:', JSON.stringify(whereClause));

        const lotes = await Lote.findAll({
            where: whereClause,
            include: [{
                model: Producto,
                as: 'producto',
                // atributos según tu modelo Producto (usa nombres exactos)
                attributes: ['idProducto', 'Nombre', 'Presentacion']
            }],
            order: [['Caducidad', 'ASC']]
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
        const { unidadesExistentes, Caducidad, idProducto, idEntrada } = data;

        // Validar datos requeridos
        if (!unidadesExistentes || !Caducidad || !idProducto || !idEntrada) {
            return {
                success: false,
                message: 'Faltan datos obligatorios del lote',
                statusCode: 400
            };
        }

        // Validar existencia de producto
        const productoExiste = await Producto.findByPk(idProducto);
        if (!productoExiste) {
            return {
                success: false,
                message: 'El producto asociado no existe',
                statusCode: 400
            };
        }

        // Crear el lote
        const nuevoLote = await Lote.create({
            unidadesExistentes,
            Caducidad,
            Activo: 1,
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
}
module.exports = LoteService;