const EntradasService = require('../Services/entradas.service');
const ReportesVO = require('../ValueObjects/reportes.vo');

exports.getReporteEntradas = async (req, res) => {
    try {
        const data = req.body;
        const reporteVO = new ReportesVO(data);
        const validation = reporteVO.validate();

        if (!validation.isValid) {
            return res.status(400).json({ errors: validation.errors });
        }
        
        const result = await EntradasService.generarReporteEntradas(reporteVO);
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
};

module.exports = {
    getReporteEntradas: exports.getReporteEntradas,
    };