const express = require('express');
const router = express.Router();
const LotesController = require('../Controllers/lotes.controller');

// GET - Generar reporte de lotes
router.get('/reportes', LotesController.getReporteLotes);

module.exports = router;
