const LoteService = require('../Services/lote.service');

class LoteController {

    // GET /api/inventario/lotes/idproducto/:idProducto
    static async getByIdProducto(req, res) {
        try {
            const { idProducto } = req.params;
            const result = await LoteService.getLotesByIdProducto(idProducto);
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
        const result = await LoteService.getLotesByNombreProducto(nombre);
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
            const result = await LoteService.getLotesByFecha(desde, hasta);
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
            const result = await LoteService.createLote(req.body);
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

module.exports = LoteController;
