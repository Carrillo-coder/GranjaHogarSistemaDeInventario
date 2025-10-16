
const db = require('../Models');
const Entrada = db.Entrada;

class EntradaService {

    static async createEntrada(data) {
        try {
            const nuevaEntrada = await Entrada.create(data);
            return {
                success: true,
                message: 'Entrada creada correctamente',
                data: nuevaEntrada,
                statusCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear entrada',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = EntradaService;
