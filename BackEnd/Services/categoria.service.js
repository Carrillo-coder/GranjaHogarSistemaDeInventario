const db = require('../Models');
const Categoria = db.Categoria;
const { Op } = db.Sequelize;

class CategoriaService {

    // GET /api/inventario/categorias
    static async getAllCategorias() {
        try {
            const categorias = await Categoria.findAll({
                order: [['nombre', 'ASC']]
            });

            if (!categorias || categorias.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron categorías',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Categorías obtenidas correctamente',
                data: categorias,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener categorías',
                error: error.message,
                statusCode: 400
            };
        }
    }

    // GET /api/inventario/categorias/:id
    static async getCategoriaById(id) {
        try {
            const categoria = await Categoria.findOne({
                where: {
                    idCategoria: id
                }
            });

            if (!categoria) {
                return {
                    success: false,
                    message: 'Categoría no encontrada',
                    data: null,
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Categoría obtenida correctamente',
                data: categoria,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener categoría',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = CategoriaService;
