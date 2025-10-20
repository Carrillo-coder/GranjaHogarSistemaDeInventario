const LotesService = require('../Services/lotes.services');

class LotesController {
    static async getReporteLotes(req, res) {
        try {
            const { formato } = req.query;

            if (!formato || formato.trim() === '') {
                return res.status(400).json({ success: false, message: 'El parámetro "formato" es obligatorio.' });
            } else if (!['XLSX', 'PDF'].includes(formato)) {
                return res.status(400).json({ success: false, message: 'El formato debe ser XLSX o PDF.' });
            }

            const { buffer, filename } = await LotesService.generarReporteLotes(formato);
            const base64 = buffer.toString('base64');
            const mimeType = formato === 'PDF'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            return res.json({
                success: true,
                filename,
                mimeType,
                base64,
            });

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