const db = require('../Models');
const ProductoVO = require('../ValueObjects/producto.vo');

const Producto = db.Producto;
const Lote = db.Lote;
const Categoria = db.Categoria;

class ProductoService {


    // Obtener todos los productos o buscar por nombre/presentación
    static async getProductos(filters = {}) {
        try {
            const where = {};
            if (filters.nombre) where.Nombre = { [db.Sequelize.Op.like]: `%${filters.nombre}%` };
            if (filters.presentacion) where.Presentacion = { [db.Sequelize.Op.like]: `%${filters.presentacion}%` };

            const productos = await Producto.findAll({
                where,
                include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['idCategoria', 'Nombre']
                }],
                order: [['Nombre', 'ASC']]
            });

            if (!productos || productos.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron productos',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Productos obtenidos correctamente',
                data: productos,
                statusCode: 200
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener productos',
                error: error.message,
                statusCode: 400
            };
        }
    }

    static async getAllProductos() {
        return this.getProductos(); // llama a la función original sin filtros
    }

    // Obtener producto por ID
    static async getProductoById(id) {
        try {
            const producto = await Producto.findByPk(id, {
                include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['idCategoria', 'Nombre']
                }]
            });

            if (!producto) {
                return {
                    success: false,
                    message: 'Producto no encontrado',
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Producto obtenido correctamente',
                data: producto,
                statusCode: 200
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener producto',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // Crear un nuevo producto
    static async createProducto(data) {
        try {
            const productoVO = new ProductoVO(data);
            const validation = productoVO.validate();

            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Datos inválidos',
                    errors: validation.errors,
                    statusCode: 400
                };
            }

            // Validar que la categoría exista
            const categoriaExists = await Categoria.findByPk(data.idCategoria);
            if (!categoriaExists) {
                return {
                    success: false,
                    message: 'La categoría especificada no existe',
                    statusCode: 400
                };
            }

            const nuevoProducto = await Producto.create(productoVO.toDatabase());
            return {
                success: true,
                message: 'Producto creado correctamente',
                data: nuevoProducto,
                statusCode: 201
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al crear producto',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // Obtener cantidad total (sumando todos los lotes del producto)
    static async getCantidadTotal(idProducto) {
        try {
            const lotes = await Lote.findAll({
                where: { idProducto, Activo: 1 },
                attributes: ['unidadesExistentes']
            });

            if (!lotes || lotes.length === 0) {
                return {
                    success: false,
                    message: 'No hay lotes activos para este producto',
                    data: 0,
                    statusCode: 204
                };
            }

            const total = lotes.reduce((sum, l) => sum + (l.unidadesExistentes || 0), 0);

            return {
                success: true,
                message: 'Cantidad total calculada correctamente',
                data: { idProducto, cantidadTotal: total },
                statusCode: 200
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al calcular cantidad total',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // Obtener la fecha de caducidad más próxima
    static async getCaducidadMasProxima(idProducto) {
        try {
            const lote = await Lote.findOne({
                where: { idProducto, Activo: 1 },
                order: [['Caducidad', 'ASC']]
            });

            if (!lote) {
                return {
                    success: false,
                    message: 'No hay lotes activos para este producto',
                    data: null,
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Fecha de caducidad más próxima obtenida correctamente',
                data: { idProducto, caducidad: lote.Caducidad },
                statusCode: 200
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener caducidad más próxima',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = ProductoService;
