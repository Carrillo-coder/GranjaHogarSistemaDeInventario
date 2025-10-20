const express = require('express');
const { query, param, body } = require('express-validator');
const ProductosController = require('../Controllers/producto.controller');
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

router.get('/:id/cantidad',
  [ param('id').isInt().withMessage('id debe ser entero') ],
  ProductosController.getCantidad
);

router.get('/:id/caducidad',
  [ param('id').isInt().withMessage('id debe ser entero') ],
  ProductosController.getCaducidad
);

router.post('/',
  [
    body('nombre').optional().isString().trim(),
    body('Nombre').optional().isString().trim(),
    body('presentacion').optional().isString().trim(),
    body('Presentacion').optional().isString().trim(),
    body('categoria').optional().isString().trim(),
    body('categoría').optional().isString().trim(),
    body('idCategoria').optional().isInt().toInt(),

    body('nombre').if(body('Nombre').not().exists())
      .notEmpty().withMessage('nombre es obligatorio')
      .matches(letters).withMessage('nombre solo permite letras y espacios'),
    body('presentacion').if(body('Presentacion').not().exists())
      .notEmpty().withMessage('presentacion es obligatoria')
      .matches(presentAllowed).withMessage('presentacion inválida'),
  ],
  ProductosController.create
);

router.put('/:id',
  [
    param('id').isInt().withMessage('id debe ser entero'),
    body('nombre').optional().isString().trim(),
    body('Nombre').optional().isString().trim(),
    body('presentacion').optional().isString().trim(),
    body('Presentacion').optional().isString().trim(),
    body('categoria').optional().isString().trim(),
    body('categoría').optional().isString().trim(),
    body('idCategoria').optional().isInt().toInt()
  ],
  ProductosController.update
);

router.delete('/:id',
  [ param('id').isInt().withMessage('id debe ser entero') ],
  ProductosController.delete
);

module.exports = router;
