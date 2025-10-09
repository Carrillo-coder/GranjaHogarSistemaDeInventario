const TiposSalidasService = require('../Services/tiposSalidas.service');


class TiposSalidasController {

    static async getAll(req, res) {
        try {
            const result = await TiposSalidasService.getAllRoles();
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

module.exports = TiposSalidasController;