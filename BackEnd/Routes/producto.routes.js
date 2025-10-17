const express = require('express');
const router = express.Router();
const ProductoController = require('../Controllers/producto.controller');

// GET productos filtrados o todos
// /api/inventario/productos?nombre=Manzana&presentacion=bolsa
router.get('/', ProductoController.getAll);

// GET producto por ID
router.get('/:id', ProductoController.getById);

// GET cantidad total de un producto
router.get('/:id/cantidad', ProductoController.getCantidad);

// GET caducidad más próxima de un producto
router.get('/:id/caducidad', ProductoController.getCaducidad);

// POST crear producto
router.post('/', ProductoController.create);

// PUT actualizar producto
router.put('/:id', ProductoController.update);

// DELETE producto
router.delete('/:id', ProductoController.delete);

module.exports = router;
