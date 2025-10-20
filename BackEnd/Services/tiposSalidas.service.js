const db = require('../Models');        
const TiposSalidas = db.TipoSalida;
const TiposSalidasVO = require('../ValueObjects/tiposSalidas.vo');

class TiposSalidasService {

    static async getAllTiposSalidas() {
        try {
            const tiposSalidas = await TiposSalidas.findAll({});

            if (!tiposSalidas || tiposSalidas.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron tipos de salidas',
                    data: [],
                    statusCode: 204
                };
            }

            const tiposSalidasVO = tiposSalidas.map(tipoSalida => new TiposSalidasVO(tipoSalida));

            return {
                success: true,
                message: 'Tipos de salidas obtenidos correctamente',
                data: tiposSalidasVO,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener tipos de salidas',
                error: error.message,
                statusCode: 500
            };
        }
    }
}

module.exports = TiposSalidasService;