const express = require('express');
const router = express.Router();
const SalidasController = require('../Controllers/salidas.controller');

// POST - Generar reporte de salidas
router.post('/reportes', SalidasController.getReporteSalidas);
router.get('/', SalidasController.getAllSalidas);
router.get('/:id', SalidasController.getSalidaById);
router.post('/', SalidasController.createSalida);

module.exports = router;
