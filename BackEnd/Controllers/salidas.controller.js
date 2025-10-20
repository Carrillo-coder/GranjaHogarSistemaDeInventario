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