const LotesService = require('../Services/lotes.service');

class LotesController {

    // GET /api/inventario/lotes/reporte?formato=CSV|PDF
    static async getReporteLotes(req, res) {
        try {
            const { formato } = req.query;

            if (!formato || formato.trim() === '') {
                return res.status(400).json({ success: false, error: 'El parámetro "formato" es obligatorio.' });
            } else if (!['XLSX', 'PDF'].includes(formato)) {
                return res.status(400).json({ success: false, error: 'El formato debe ser XLSX o PDF.' });
            }

            const { buffer, filename } = await LotesService.generarReporteLotes(formato);
            const base64 = buffer.toString('base64');
            const mimeType = formato === 'PDF'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            return res.status(200).json({
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

    // GET /api/inventario/lotes/idproducto/:idProducto
    static async getByIdProducto(req, res) {
        try {
            const { idProducto } = req.params;
            const result = await LotesService.getLotesByIdProducto(idProducto);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/inventario/lotes/nombre/:nombre
    static async getByNombreProducto(req, res) {
        try {
            const { nombre } = req.params;
            const result = await LotesService.getLotesByNombreProducto(nombre);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/inventario/lotes/fechas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
    static async getByFecha(req, res) {
        try {
            const { desde, hasta } = req.query;
            const result = await LotesService.getLotesByFecha(desde, hasta);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST /api/inventario/lotes
    static async create(req, res) {
        try {
            const result = await LotesService.createLote(req.body);
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


module.exports = LotesController;