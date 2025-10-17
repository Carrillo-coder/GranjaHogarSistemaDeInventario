
const express = require('express');
const router = express.Router();
const EntradaController = require('../Controllers/entradas.controller');

// POST Crear entrada
router.post('/', EntradaController.create);

// GET Obtener todos los tipos disponibles
router.get('/tipo', EntradaController.getTipos);

module.exports = router;
