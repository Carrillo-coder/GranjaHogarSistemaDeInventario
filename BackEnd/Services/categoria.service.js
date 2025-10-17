const db = require('../Models');
const Categoria = db.Categoria;
const CategoriaVO = require('../ValueObjects/categoria.vo');

class CategoriaService {

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
                    statusCode: 404
                };
            }

            return {
                success: true,
                message: 'Categoría obtenida correctamente',
                data: new CategoriaVO(categoria),
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener categoría',
                error: error.message,
                statusCode: 500
            };
        }
    }

    static async getCategoriaByNombre(nombre) {
        try {
            const categoria = await Categoria.findOne({ where: { Nombre: nombre } });
            if (!categoria) {
                return {
                    success: false,
                    message: 'Categoría no encontrada',
                    data: null,
                    statusCode: 404
                };
            }

            return {
                success: true,
                message: 'Categoría obtenida correctamente',
                data: new CategoriaVO(categoria),
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener categoría',
                error: error.message,
                statusCode: 500
            };
        }
    }
}

module.exports = CategoriaService;
