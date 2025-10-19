const express = require('express');
const router = express.Router();
const LoteController = require('../Controllers/lote.controller');

// GET /api/inventario/lotes/idproducto/:idProducto
router.get('/idproducto/:idProducto', LoteController.getByIdProducto);

// GET /api/inventario/lotes/nombre/:nombre
router.get('/nombre/:nombre', LoteController.getByNombreProducto);

// GET /api/inventario/lotes/fechas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
router.get('/fechas', LoteController.getByFecha);

// POST /api/inventario/lotes
router.post('/', LoteController.create);

module.exports = router;