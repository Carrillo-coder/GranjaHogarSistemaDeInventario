const express = require('express');
const router = express.Router();
const UsuarioController = require('../Controllers/usuarios.controller');

// GET - Obtener todos los usuarios
router.get('/', UsuarioController.getAll);

// GET - Obtener usuario por ID
router.get('/:id', UsuarioController.getById);

// GET - Obtener usuario por Username
router.get('/nombreUsuario/:nombreUsuario', UsuarioController.getByNombreUsuario);

// POST - Crear nuevo usuario
router.post('/', UsuarioController.create);

// PUT - Actualizar usuario
router.put('/:id', UsuarioController.update);

// DELETE - Desactivar usuario
router.delete('/:id', UsuarioController.delete);

module.exports = router;