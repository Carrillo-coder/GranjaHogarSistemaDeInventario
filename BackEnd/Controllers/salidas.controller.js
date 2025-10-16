const SalidaService = require('../Services/salidas.service');

class SalidaController {
    static async getAllSalidas(req, res) {
        try {
            const salidas = await SalidaService.getAllSalidas();
            res.status(200).json(salidas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las salidas' });
        }
    }

    static async getSalidaById(req, res) {
        try {
            const { id } = req.params;
            const salida = await SalidaService.getSalidaById(id);
            if (!salida) return res.status(404).json({ message: 'Salida no encontrada' });
            res.status(200).json(salida);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la salida' });
        }
    }

    static async createSalida(req, res) {
        try {
            const data = req.body;
            const nuevaSalida = await SalidaService.createSalida(data);
            res.status(201).json(nuevaSalida);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la salida', error: error.message });
        }
    }
}

module.exports = SalidaController;
