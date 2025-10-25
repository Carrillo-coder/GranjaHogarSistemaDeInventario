const ProductosService = require('../../Services/productos.service');
const ProductoVO = require('../../ValueObjects/productos.vo');
jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('../../Models', () => ({
  Producto: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    associations: {
      categoria: true
    }
  },
  Categoria: {
    findOrCreate: jest.fn(),
    findByPk: jest.fn()
  },
  Lote: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn()
  },
  Sequelize: {
    Op: {
      like: Symbol('like'),
      in: Symbol('in'),
      ne: Symbol('ne')
    }
  }
}));

jest.mock('../../ValueObjects/productos.vo', () => {
  return jest.fn().mockImplementation((data) => ({
    nombre: data.nombre || '',
    presentacion: data.presentacion || '',
    categoriaText: data.categoria || '',
    idCategoria: data.idCategoria ?? null,
    validate: jest.fn()
  }));
});

const db = require('../../Models');

describe("ProductosService Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    test('Debe devolver todos los productos correctamente con stock calculado', async () => {
      const mockProductos = [
        { 
          idProducto: 1, 
          nombre: 'Producto 1', 
          presentacion: 'Tabletas',
          toJSON: jest.fn().mockReturnValue({ idProducto: 1, nombre: 'Producto 1', presentacion: 'Tabletas' })
        },
        { 
          idProducto: 2, 
          nombre: 'Producto 2', 
          presentacion: 'Jarabe',
          toJSON: jest.fn().mockReturnValue({ idProducto: 2, nombre: 'Producto 2', presentacion: 'Jarabe' })
        }
      ];

      const mockLotes = [
        { idProducto: 1, unidadesExistentes: 100 },
        { idProducto: 1, unidadesExistentes: 50 },
        { idProducto: 2, unidadesExistentes: 75 }
      ];

      db.Producto.findAll.mockResolvedValue(mockProductos);
      db.Lote.findAll.mockResolvedValue(mockLotes);

      const result = await ProductosService.getAll({});

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual([
        { idProducto: 1, nombre: 'Producto 1', presentacion: 'Tabletas', cantidadTotal: 150 },
        { idProducto: 2, nombre: 'Producto 2', presentacion: 'Jarabe', cantidadTotal: 75 }
      ]);
      expect(db.Producto.findAll).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Array),
        order: [['nombre', 'ASC']]
      });
    });

    test('Debe filtrar productos por nombre y presentación', async () => {
      const mockProductos = [{ 
        idProducto: 1, 
        nombre: 'Paracetamol', 
        presentacion: 'Tabletas',
        toJSON: jest.fn().mockReturnValue({ idProducto: 1, nombre: 'Paracetamol', presentacion: 'Tabletas' })
      }];
      
      db.Producto.findAll.mockResolvedValue(mockProductos);
      db.Lote.findAll.mockResolvedValue([]);

      const result = await ProductosService.getAll({ 
        nombre: 'Paracetamol', 
        presentacion: 'Tabletas' 
      });

      expect(result.success).toBe(true);
      expect(db.Producto.findAll).toHaveBeenCalledWith({
        where: {
          nombre: { [db.Sequelize.Op.like]: '%Paracetamol%' },
          presentacion: { [db.Sequelize.Op.like]: '%Tabletas%' }
        },
        include: expect.any(Array),
        order: [['nombre', 'ASC']]
      });
    });

    test('Debe devolver mensaje cuando no se encuentran productos', async () => {
      db.Producto.findAll.mockResolvedValue([]);
      db.Lote.findAll.mockResolvedValue([]);

      const result = await ProductosService.getAll({});

      expect(result.success).toBe(true);
      expect(result.message).toBe('No se encontraron productos');
      expect(result.data).toEqual([]);
    });

    test('Debe manejar errores correctamente', async () => {
      db.Producto.findAll.mockRejectedValue(new Error('Error de base de datos'));

      const result = await ProductosService.getAll({});

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Error al obtener productos');
    });
  });

  describe("getById", () => {
    test('Debe devolver un producto por su ID', async () => {
      const mockProducto = { idProducto: 1, nombre: 'Producto Test', presentacion: 'Tabletas' };
      db.Producto.findByPk.mockResolvedValue(mockProducto);

      const result = await ProductosService.getById(1);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockProducto);
      expect(db.Producto.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    });

    test('Debe devolver 404 si el producto no se encuentra', async () => {
      db.Producto.findByPk.mockResolvedValue(null);

      const result = await ProductosService.getById(99);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Producto no encontrado');
    });

    test('Debe manejar errores correctamente', async () => {
      db.Producto.findByPk.mockRejectedValue(new Error('Error de base de datos'));

      const result = await ProductosService.getById(1);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
    });
  });

  describe("create", () => {
    const validProductData = {
      nombre: 'Nuevo Producto',
      presentacion: 'Tabletas 500mg',
      categoria: 'Analgésicos'
    };

    test('Debe crear un producto exitosamente con nueva categoría', async () => {
      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Nuevo Producto',
        presentacion: 'Tabletas 500mg',
        categoriaText: 'Analgésicos',
        idCategoria: null
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Categoria.findOrCreate.mockResolvedValue([{ idCategoria: 1 }, true]);
      db.Producto.findOne.mockResolvedValue(null);
      db.Producto.create.mockResolvedValue({ idProducto: 1 });
      db.Producto.findByPk.mockResolvedValue({ 
        idProducto: 1, 
        nombre: 'Nuevo Producto', 
        presentacion: 'Tabletas 500mg' 
      });

      const result = await ProductosService.create(validProductData);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Producto creado correctamente');
      expect(db.Categoria.findOrCreate).toHaveBeenCalledWith({
        where: { nombre: 'Analgésicos' },
        defaults: { nombre: 'Analgésicos' }
      });
      expect(db.Producto.create).toHaveBeenCalledWith({
        nombre: 'Nuevo Producto',
        presentacion: 'Tabletas 500mg',
        idCategoria: 1
      });
    });

    test('Debe crear un producto con idCategoria existente', async () => {
      const productDataWithIdCategoria = {
        nombre: 'Producto con Categoria',
        presentacion: 'Jarabe',
        idCategoria: 2
      };

      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Producto con Categoria',
        presentacion: 'Jarabe',
        categoriaText: '',
        idCategoria: 2
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Categoria.findByPk.mockResolvedValue({ idCategoria: 2 });
      db.Producto.findOne.mockResolvedValue(null);
      db.Producto.create.mockResolvedValue({ idProducto: 1 });
      db.Producto.findByPk.mockResolvedValue({ idProducto: 1 });

      const result = await ProductosService.create(productDataWithIdCategoria);

      expect(result.success).toBe(true);
      expect(db.Categoria.findByPk).toHaveBeenCalledWith(2);
      expect(db.Producto.create).toHaveBeenCalledWith({
        nombre: 'Producto con Categoria',
        presentacion: 'Jarabe',
        idCategoria: 2
      });
    });

    test('Debe fallar si la validación del VO no pasa', async () => {
      const mockValidation = { 
        isValid: false, 
        errors: ['Nombre inválido'] 
      };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation)
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);

      const result = await ProductosService.create(validProductData);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Datos inválidos');
    });

    test('Debe fallar si la categoría no existe', async () => {
      const productDataWithIdCategoria = {
        nombre: 'Producto Test',
        presentacion: 'Tabletas',
        idCategoria: 999
      };

      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Producto Test',
        presentacion: 'Tabletas',
        categoriaText: '',
        idCategoria: 999
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Categoria.findByPk.mockResolvedValue(null);

      const result = await ProductosService.create(productDataWithIdCategoria);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('La categoría especificada no existe');
    });

    test('Debe fallar si el producto ya existe', async () => {
      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Nuevo Producto',
        presentacion: 'Tabletas 500mg',
        categoriaText: 'Analgésicos',
        idCategoria: null
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Categoria.findOrCreate.mockResolvedValue([{ idCategoria: 1 }, true]);
      db.Producto.findOne.mockResolvedValue({ idProducto: 2 }); // Producto duplicado

      const result = await ProductosService.create(validProductData);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Ya existe un producto con el mismo nombre y presentación');
    });
  });

  describe("update", () => {
    const updateData = {
      nombre: 'Producto Actualizado',
      presentacion: 'Tabletas 1000mg',
      categoria: 'Analgésicos Potentes'
    };

    test('Debe actualizar un producto exitosamente', async () => {
      const existingProduct = { idProducto: 1, nombre: 'Producto Viejo', presentacion: 'Tabletas' };
      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Producto Actualizado',
        presentacion: 'Tabletas 1000mg',
        categoriaText: 'Analgésicos Potentes',
        idCategoria: null
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Producto.findByPk.mockResolvedValueOnce(existingProduct);
      db.Categoria.findOrCreate.mockResolvedValue([{ idCategoria: 2 }, true]);
      db.Producto.findOne.mockResolvedValue(null);
      db.Producto.update.mockResolvedValue([1]);
      db.Producto.findByPk.mockResolvedValueOnce({ 
        idProducto: 1, 
        nombre: 'Producto Actualizado', 
        presentacion: 'Tabletas 1000mg' 
      });

      const result = await ProductosService.update(1, updateData);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Producto actualizado correctamente');
      expect(db.Producto.update).toHaveBeenCalledWith(
        {
          nombre: 'Producto Actualizado',
          presentacion: 'Tabletas 1000mg',
          idCategoria: 2
        },
        { where: { idProducto: 1 } }
      );
    });

    test('Debe fallar si el producto a actualizar no existe', async () => {
      db.Producto.findByPk.mockResolvedValue(null);

      const result = await ProductosService.update(99, updateData);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Producto no encontrado');
    });

    test('Debe fallar si ya existe otro producto con mismo nombre y presentación', async () => {
      const existingProduct = { idProducto: 1 };
      const mockValidation = { isValid: true, errors: [] };
      const mockProductoVO = {
        validate: jest.fn().mockReturnValue(mockValidation),
        nombre: 'Producto Actualizado',
        presentacion: 'Tabletas 1000mg',
        categoriaText: 'Analgésicos',
        idCategoria: null
      };
      
      ProductoVO.mockImplementation(() => mockProductoVO);
      db.Producto.findByPk.mockResolvedValueOnce(existingProduct);
      db.Categoria.findOrCreate.mockResolvedValue([{ idCategoria: 1 }, true]);
      db.Producto.findOne.mockResolvedValue({ idProducto: 2 }); // Producto duplicado

      const result = await ProductosService.update(1, updateData);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Ya existe otro producto con el mismo nombre y presentación');
    });
  });

  describe("remove", () => {
    test('Debe eliminar un producto exitosamente', async () => {
      db.Lote.count.mockResolvedValue(0);
      db.Producto.destroy.mockResolvedValue(1);

      const result = await ProductosService.remove(1);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Producto eliminado correctamente');
      expect(db.Lote.count).toHaveBeenCalledWith({
        where: { idProducto: 1, activo: true }
      });
    });

    test('Debe fallar si existen lotes activos asociados', async () => {
      db.Lote.count.mockResolvedValue(5);

      const result = await ProductosService.remove(1);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('No se puede eliminar: existen lotes activos asociados');
      expect(db.Producto.destroy).not.toHaveBeenCalled();
    });

    test('Debe fallar si el producto no existe', async () => {
      db.Lote.count.mockResolvedValue(0);
      db.Producto.destroy.mockResolvedValue(0);

      const result = await ProductosService.remove(99);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Producto no encontrado');
    });
  });

  describe("getCantidadTotal", () => {
    test('Debe calcular la cantidad total correctamente', async () => {
      const mockLotes = [
        { unidadesExistentes: 100 },
        { unidadesExistentes: 50 },
        { unidadesExistentes: 25 }
      ];

      db.Lote.findAll.mockResolvedValue(mockLotes);

      const result = await ProductosService.getCantidadTotal(1);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 1, cantidadTotal: 175 });
      expect(db.Lote.findAll).toHaveBeenCalledWith({
        where: { idProducto: 1, activo: true },
        attributes: ['unidadesExistentes']
      });
    });

    test('Debe devolver 0 cuando no hay lotes activos', async () => {
      db.Lote.findAll.mockResolvedValue([]);

      const result = await ProductosService.getCantidadTotal(1);

      expect(result.success).toBe(true);
      expect(result.data.cantidadTotal).toBe(0);
      expect(result.message).toBe('No hay lotes activos para este producto');
    });
  });

  describe("getCaducidadMasProxima", () => {
    test('Debe obtener la caducidad más próxima correctamente', async () => {
      const mockLote = { caducidad: '2024-12-31' };
      db.Lote.findOne.mockResolvedValue(mockLote);

      const result = await ProductosService.getCaducidadMasProxima(1);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 1, caducidad: '2024-12-31' });
      expect(db.Lote.findOne).toHaveBeenCalledWith({
        where: { idProducto: 1, activo: true },
        order: [['caducidad', 'ASC']]
      });
    });

    test('Debe devolver null cuando no hay lotes activos', async () => {
      db.Lote.findOne.mockResolvedValue(null);

      const result = await ProductosService.getCaducidadMasProxima(1);

      expect(result.success).toBe(true);
      expect(result.data.caducidad).toBe(null);
      expect(result.message).toBe('No hay lotes activos para este producto');
    });
  });
});