
const express = require('express');
const router = express.Router();
const LoteController = require('../Controllers/lotes.controller');

// POST crea nuevo lote
router.post('/', LoteController.create);

module.exports = router;
