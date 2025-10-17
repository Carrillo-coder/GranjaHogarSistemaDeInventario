const LotesService = require('../Services/lotes.services');

class LotesController {
    static async getReporteLotes(req, res) {
        try {
            const { formato } = req.query;

            if (!formato || formato.trim() === '') {
                return res.status(400).json({ success: false, message: 'El parámetro "formato" es obligatorio.', error: error.message });
            } else if (!['CSV', 'PDF'].includes(formato)) {
                return res.status(400).json({ success: false, message: 'El formato debe ser CSV o PDF.', error: error.message });
            }

            const { buffer, filename } = await LotesService.generarReporteLotes(formato);
            if (formato === 'PDF') {
                res.setHeader('Content-Type', 'application/pdf');
            } else if (formato === 'CSV') {
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            }
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            return res.send(buffer);

        } catch (error) {
            console.error('Error al generar el reporte de inventario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};


module.exports = LotesController;