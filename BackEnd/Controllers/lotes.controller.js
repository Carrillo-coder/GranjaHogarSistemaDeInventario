
const LoteService = require('../Services/lotes.service');

class LoteController {

    static async create(req, res) {
        try {
            const result = await LoteService.createLote(req.body);
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

module.exports = LoteController;
