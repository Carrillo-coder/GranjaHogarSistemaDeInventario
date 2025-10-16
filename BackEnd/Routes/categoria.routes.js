const express = require('express');
const router = express.Router();
const CategoriaController = require('../Controllers/categoria.controller');

router.get('/:nombre', CategoriaController.getByNombre);

module.exports = router;