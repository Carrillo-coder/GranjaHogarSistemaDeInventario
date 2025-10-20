const { validationResult } = require('express-validator');
const ProductosService = require('../Services/producto.service');

class ProductosController {
  static async getAll(req, res) {
    const result = await ProductosService.getAll({
      nombre: req.query.nombre,
      presentacion: req.query.presentacion
    });
    return res.status(result.statusCode).json(result);
  }

  static async getById(req, res) {
    const result = await ProductosService.getById(req.params.id);
    return res.status(result.statusCode).json(result);
  }

  static async create(req, res) {
    if (req.body['categoría'] && !req.body['categoria'])
      req.body['categoria'] = req.body['categoría'];
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const result = await ProductosService.create(req.body);
    return res.status(result.statusCode).json(result);
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const result = await ProductosService.update(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  }

  static async delete(req, res) {
    const result = await ProductosService.remove(req.params.id);
    return res.status(result.statusCode).json(result);
  }

  static async getCantidad(req, res) {
    const result = await ProductosService.getCantidadTotal(req.params.id);
    return res.status(result.statusCode).json(result);
  }

  static async getCaducidad(req, res) {
    const result = await ProductosService.getCaducidadMasProxima(req.params.id);
    return res.status(result.statusCode).json(result);
  }
}
module.exports = ProductosController;