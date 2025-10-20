const express = require('express');
const router = express.Router();
const CategoriasController = require('../Controllers/categorias.controller');

// GET /api/inventario/categorias/ -> Obtener todas las categorias
router.get('/', CategoriasController.getAll);

// GET /api/inventario/categorias/id/:id -> Obtener categoria por ID
router.get('/id/:id', CategoriasController.getById);

// GET /api/inventario/categorias/nombre/:nombre -> Obtener categoria por nombre
router.get('/nombre/:nombre', CategoriasController.getByNombre);

module.exports = router;