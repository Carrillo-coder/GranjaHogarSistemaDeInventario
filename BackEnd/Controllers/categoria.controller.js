const CategoriaService = require('../Services/categoria.service');

class CategoriaController {


    // GET /api/inventario/categorias/:id
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await CategoriaService.getCategoriaById(id);
                 return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
    static async getByNombre(req, res) {
        try {
            const { nombre } = req.params;
            const result = await CategoriaService.getCategoriaByNombre(nombre);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}


module.exports = CategoriaController;

