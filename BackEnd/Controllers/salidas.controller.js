const SalidasService = require('../Services/salidas.service');
const ReportesVO = require('../ValueObjects/reportes.vo');

class SalidasController {
    static async getReporteSalidas(req, res) {
        try {
            const { departamento } = req.query;
            const data = req.body;
            const reporteVO = new ReportesVO(data);
            const validation = reporteVO.validate();
            
            if (!validation.isValid) {
                return res.status(400).json({ errors: validation.errors });
            }

            if (!departamento || departamento.trim() === '') {
                return res.status(400).json({ error: 'El parámetro "departamento" es obligatorio.' });
            }

            const { buffer, filename } = await SalidasService.generarReporteSalidas(reporteVO, departamento);

            if (reporteVO.formato === 'PDF') {
                res.setHeader('Content-Type', 'application/pdf');
            } else if (reporteVO.formato === 'CSV') {
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            }
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            return res.send(buffer);

        } catch (error) {
            console.error('Error al generar el reporte de salidas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = SalidasController;