const express = require('express');
const router = express.Router();
const EntradasController = require('../Controllers/entradas.controller');

// POST - Generar reporte de entradas
router.post('/reportes', EntradasController.getReporteEntradas);

// POST Crear entrada
router.post('/', EntradasController.createEntrada);

// GET Obtener todos los tipos disponibles
router.get('/tipo', EntradasController.getTiposEntradas);

module.exports = router;