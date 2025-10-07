const express = require('express');
const router = express.Router();
const RolController = require('../Controllers/roles.controller');

/**
 * Rutas de Roles
 * Base: /api/inventario/roles
 */

// GET - Obtener todos los roles
router.get('/', RolController.getAll);

module.exports = router;