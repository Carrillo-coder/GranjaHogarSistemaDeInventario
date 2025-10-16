const RolModel = require('../Models/roles.model');

class RolService {

    static async getAllRoles() {
        try {
            const roles = await RolModel.findAll();

            if (!roles || roles.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron roles',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Roles obtenidos correctamente',
                data: roles,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener roles',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = RolService;