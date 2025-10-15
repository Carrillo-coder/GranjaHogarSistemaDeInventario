const express = require('express');
const router = express.Router();
const CategoriaController = require('../Controllers/categoria.controller');

router.get('/', CategoriaController.getByNombre);

module.exports = router;