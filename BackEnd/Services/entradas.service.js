
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

    static async getEntradasByTipo(idTipo) {
        try {
            const entradas = await Entrada.findAll({ where: { ID_Tipo: idTipo } });
            if (!entradas || entradas.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron entradas para este tipo',
                    data: [],
                    statusCode: 204
                };
            }
            return {
                success: true,
                message: 'Entradas obtenidas correctamente',
                data: entradas,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener entradas por tipo',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = EntradaService;
