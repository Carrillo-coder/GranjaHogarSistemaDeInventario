// Routes/alertas.routes.js
const express = require('express');
const router = express.Router();
const AlertasController = require('../Controllers/alertas.controller');

// Productos por caducar (default 10 días) => ?dias=10 (opcional)
router.get('/por-caducar', AlertasController.getPorCaducar);

// Productos bajos en stock (default umbral=10) => ?umbral=10 (opcional)
router.get('/bajos', AlertasController.getBajos);

// Productos altos en stock (default umbral=100) => ?umbral=100 (opcional)
router.get('/altos', AlertasController.getAltos);

module.exports = router;
