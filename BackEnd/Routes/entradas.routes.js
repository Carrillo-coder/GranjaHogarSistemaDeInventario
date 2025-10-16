
const express = require('express');
const router = express.Router();
const EntradaController = require('../Controllers/entradas.controller');

// POST Crear entrada
router.post('/', EntradaController.create);

// GET Obtener entradas por tipo
router.get('/tipo/:idTipo', EntradaController.getByTipo);

module.exports = router;
