const { get } = require('../routes/entradas.routes');
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

            const result = await SalidasService.generarReporteSalidas(reporteVO, departamento);
            res.download(result, (error) => {
                if (error) {
                    console.error('Error al enviar el archivo:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Error al generar el reporte',
                        error: error.message
                    });
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = SalidasController;