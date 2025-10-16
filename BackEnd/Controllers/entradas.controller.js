
const EntradaService = require('../Services/entradas.service');

class EntradaController {

    static async create(req, res) {
        try {
            const result = await EntradaService.createEntrada(req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getByTipo(req, res) {
        try {
            const { idTipo } = req.params;
            const result = await EntradaService.getEntradasByTipo(idTipo);
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

module.exports = EntradaController;
