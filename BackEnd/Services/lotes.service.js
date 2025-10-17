
const db = require('../Models');
const Lote = db.Lote;
const Producto = db.Producto;
const Entrada = db.Entrada;

class LoteService {

    static async createLote(data) {
        try {
            // Validaciones básicas de integridad referencial
            if (!data.idProducto) {
                return {
                    success: false,
                    message: 'El campo idProducto es obligatorio',
                    statusCode: 400
                };
            }

            const producto = await Producto.findByPk(data.idProducto);
            if (!producto) {
                return {
                    success: false,
                    message: `Producto con idProducto=${data.idProducto} no encontrado`,
                    statusCode: 400
                };
            }

            if (!data.idEntrada) {
                return {
                    success: false,
                    message: 'El campo idEntrada es obligatorio',
                    statusCode: 400
                };
            }

            const entrada = await Entrada.findByPk(data.idEntrada);
            if (!entrada) {
                return {
                    success: false,
                    message: `Entrada con idEntrada=${data.idEntrada} no encontrada`,
                    statusCode: 400
                };
            }

            // Si no se proporciona unidadesExistentes, por defecto tomar la cantidad
            if (data.unidadesExistentes === undefined || data.unidadesExistentes === null) {
                data.unidadesExistentes = data.cantidad;
            }

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
