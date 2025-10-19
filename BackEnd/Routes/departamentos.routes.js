const express = require('express');
const router = express.Router();
const DepartamentosController = require('../Controllers/departamentos.controller');

// GET - Obtener todos los departamentos
router.get('/', DepartamentosController.getAll);

module.exports = router;