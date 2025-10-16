const express = require('express');
const router = express.Router();
const SalidasController = require('../Controllers/salidas.controller');

// POST - Generar reporte de salidas
router.post('/reportes', SalidasController.getReporteSalidas);

module.exports = router;