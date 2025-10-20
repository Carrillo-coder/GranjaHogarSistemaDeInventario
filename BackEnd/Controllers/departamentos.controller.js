const DepartamentoService = require('../Services/departamentos.service');

class DepartamentosController {

    static async getAll(req, res) {
        try {
            const result = await DepartamentoService.getAllDepartamentos();
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

module.exports = DepartamentosController;