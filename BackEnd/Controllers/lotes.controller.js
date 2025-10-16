const LotesService = require('../Services/lotes.services');

class LotesController {
    static async getReporteLotes(req, res) {
        try {
            const { formato } = req.query;

            if (!formato || formato.trim() === '') {
                return res.status(400).json({ error: 'El parámetro "formato" es obligatorio.' });
            } else if (!['CSV', 'PDF'].includes(formato)) {
                return res.status(400).json({ error: 'El formato debe ser CSV o PDF.' });
            }



            const result = await LotesService.generarReporteLotes(formato);
            return res.status(result.statusCode).json(result);

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = LotesController;