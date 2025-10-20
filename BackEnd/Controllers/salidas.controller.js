const SalidasService = require('../Services/salidas.service');
const ReportesVO = require('../ValueObjects/reportes.vo');

class SalidaController {
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

    static async getAllSalidas(req, res) {
        try {
            const salidas = await SalidaService.getAllSalidas();
            res.status(200).json(salidas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las salidas' });
        }
    }

    static async getSalidaById(req, res) {
        try {
            const { id } = req.params;
            const salida = await SalidaService.getSalidaById(id);
            if (!salida) return res.status(404).json({ message: 'Salida no encontrada' });
            res.status(200).json(salida);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la salida' });
        }
    }

    static async createSalida(req, res) {
        try {
            const data = req.body;
            const nuevaSalida = await SalidaService.createSalida(data);
            res.status(201).json(nuevaSalida);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la salida', error: error.message });
        }
    }
}

module.exports = SalidaController;
