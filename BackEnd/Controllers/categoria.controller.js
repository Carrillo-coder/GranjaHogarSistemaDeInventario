const CategoriaService = require('../Services/categoria.service');

class CategoriaController {

    static async getByNombre(req, res) {
        try {
            const { categoría } = req.query;
            const result = await CategoriaService.getCategoriaByNombre(categoría);
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