const express = require('express');
const router = express.Router();
const EntradasController = require('../Controllers/entradas.controller');

// POST - Generar reporte de entradas
router.post('/reportes', EntradasController.getReporteEntradas);

module.exports = router;