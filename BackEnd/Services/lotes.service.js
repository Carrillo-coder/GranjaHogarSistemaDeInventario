
const db = require('../Models');
const Lote = db.Lote;

class LoteService {

    static async createLote(data) {
        try {
            // Consejo de Gemini: Assuming data is valid for now
            // You can add validation using a ValueObject like in UsuarioService later

            const nuevoLote = await Lote.create(data);

            return {
                success: true,
                message: 'Lote creado correctamente',
                data: nuevoLote,
                statusCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el lote',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = LoteService;
