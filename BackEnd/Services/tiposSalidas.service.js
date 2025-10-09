const TiposSalidasModel = require('../Models/tiposSalidas.model');

class TiposSalidasService {

    static async getAllTiposSalidas() {
        try {
            const tiposSalidas = await TiposSalidasModel.findAll();

            if (!roles || roles.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron tipos de salidas',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Tipos de salidas obtenidos correctamente',
                data: tiposSalidas,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener tipos de salidas',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = TiposSalidasService;