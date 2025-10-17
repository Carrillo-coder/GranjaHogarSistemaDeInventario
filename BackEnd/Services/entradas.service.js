
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


    static async getTipos() {
        try {
            // Obtener los idTipo distintos disponibles
            const tipos = await Entrada.findAll({
                attributes: ['idTipo'],
                group: ['idTipo'],
                order: [['idTipo', 'ASC']]
            });

            // mapear al array de valores
            const tiposList = tipos.map(t => t.idTipo);

            if (!tiposList || tiposList.length === 0) {
                return {
                    success: false,
                    message: 'No hay tipos de entrada disponibles',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Tipos obtenidos correctamente',
                data: tiposList,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener tipos de entrada',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = EntradaService;
