const RolService = require('../Services/roles.service');


class RolController {

    static async getAll(req, res) {
        try {
            const result = await RolService.getAllRoles();
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

module.exports = RolController;