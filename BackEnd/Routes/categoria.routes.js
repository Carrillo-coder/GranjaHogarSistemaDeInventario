const express = require('express');
const router = express.Router();
const CategoriaController = require('../Controllers/categoria.controller');

// GET /api/inventario/categorias/ -> Obtener todas las categorias
router.get('/', CategoriaController.getAll);

// GET /api/inventario/categorias/id/:id -> Obtener categoria por ID
router.get('/id/:id', CategoriaController.getById);

// GET /api/inventario/categorias/nombre/:nombre -> Obtener categoria por nombre
router.get('/nombre/:nombre', CategoriaController.getByNombre);

module.exports = router;