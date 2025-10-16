const express = require('express');
const { query, param, body } = require('express-validator');
const ProductosController = require('../Controllers/productos.controller');
const router = express.Router();

const letters = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const presentAllowed = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/;

router.get('/',
  [ query('nombre').optional().isString().trim(),
    query('presentacion').optional().isString().trim() ],
  ProductosController.getAll
);

router.get('/:id',
  [ param('id').isInt().withMessage('id debe ser entero') ],
  ProductosController.getById
);

router.post('/',
  [
    body('nombre')
      .notEmpty().withMessage('nombre es obligatorio')
      .matches(letters).withMessage('nombre solo permite letras y espacios'),
    body('presentacion')
      .notEmpty().withMessage('presentacion es obligatoria')
      .matches(presentAllowed).withMessage('presentacion inválida'),
    body('categoria').optional().isString().trim(),
    body('categoría').optional().isString().trim()
  ],
  ProductosController.create
);

module.exports = router;
