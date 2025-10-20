const express = require('express');
const router = express.Router();
const LotesController = require('../Controllers/lotes.controller');

// GET - Generar reporte de lotes
router.get('/reportes', LotesController.getReporteLotes);

// GET /api/inventario/lotes/idproducto/:idProducto
router.get('/idproducto/:idProducto', LotesController.getByIdProducto);

// GET /api/inventario/lotes/nombre/:nombre
router.get('/nombre/:nombre', LotesController.getByNombreProducto);

// GET /api/inventario/lotes/fechas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
router.get('/fechas', LotesController.getByFecha);

// POST crea nuevo lote
router.post('/', LotesController.create);

module.exports = router;
