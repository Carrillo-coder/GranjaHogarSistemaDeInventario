const express = require('express');
const router = express.Router();
const TiposSalidasController = require('../Controllers/tiposSalidas.controller');

// GET - Obtener todos los roles
router.get('/', TiposSalidasController.getAll);

module.exports = router;