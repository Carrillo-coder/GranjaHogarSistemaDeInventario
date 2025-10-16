
const express = require('express');
const router = express.Router();
const EntradaController = require('../Controllers/entradas.controller');

// POST Crear entrada
router.post('/', EntradaController.create);

module.exports = router;
