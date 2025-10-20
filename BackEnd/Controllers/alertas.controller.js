const AlertasService = require('../Services/alertas.service');

class AlertasController {
  // GET /api/inventario/alertas/por-caducar?dias=10
  static async getPorCaducar(req, res) {
    try {
      const dias = Number(req.query.dias ?? 10);
      const result = await AlertasService.getPorCaducar(dias);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
  }

  // GET /api/inventario/alertas/bajos?umbral=10
  static async getBajos(req, res) {
    try {
      const umbral = Number(req.query.umbral ?? 10);
      const result = await AlertasService.getBajos(umbral);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
  }

  // GET /api/inventario/alertas/altos?umbral=100
  static async getAltos(req, res) {
    try {
      const umbral = Number(req.query.umbral ?? 100);
      const result = await AlertasService.getAltos(umbral);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
  }
}

module.exports = AlertasController;
