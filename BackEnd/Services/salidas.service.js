const db = require('../Models');
const Salida = db.Salida;

class SalidaService {
    static async getAllSalidas() {
        try {
            const salidas = await Salida.findAll();
            return salidas;
        } catch (error) {
            console.error('Error al obtener salidas:', error.message);
            throw error;
        }
    }

    static async getSalidaById(id) {
        try {
            const salida = await Salida.findByPk(id);
            return salida;
        } catch (error) {
            console.error('Error al obtener salida por ID:', error.message);
            throw error;
        }
    }

    static async createSalida(data) {
        try {
            const nuevaSalida = await Salida.create(data);
            return nuevaSalida;
        } catch (error) {
            console.error('Error al crear salida:', error.message);
            throw error;
        }
    }
}

module.exports = SalidaService;
