const express = require('express');
const router = express.Router();
const CategoriaController = require('../Controllers/categoria.controller');

// IMPORTANTE: primero el getAll y luego getById
router.get('/:id', CategoriaController.getById);
router.get('/:nombre', CategoriaController.getByNombre);

module.exports = router;

