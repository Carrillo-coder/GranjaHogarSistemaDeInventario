const EntradasService = require('../Services/entradas.service');
const ReportesVO = require('../ValueObjects/reportes.vo');

class EntradasController {
    static async getReporteEntradas(req, res) {
        try {
            const data = req.body;
            const reporteVO = new ReportesVO(data);
            const validation = reporteVO.validate();

            if (!validation.isValid) {
                return res.status(400).json({ errors: validation.errors });
            }

            const { buffer, filename } = await EntradasService.generarReporteEntradas(reporteVO);
            if (reporteVO.formato === 'PDF') {
                res.setHeader('Content-Type', 'application/pdf');
            } else if (reporteVO.formato === 'CSV') {
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            }
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            return res.send(buffer);

        } catch (error) {
            console.error('Error al generar el reporte de entradas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = EntradasController;