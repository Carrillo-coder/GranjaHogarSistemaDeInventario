const express = require('express');
const router = express.Router();
const SalidaController = require('../Controllers/salidas.controller');

router.get('/', SalidaController.getAllSalidas);
router.get('/:id', SalidaController.getSalidaById);
router.post('/', SalidaController.createSalida);

module.exports = router;
