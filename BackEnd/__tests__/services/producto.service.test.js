const ProductoService = require('../../Services/productos.service');

jest.mock('../../Models', () => ({
  Producto: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Categoria: {
    findOrCreate: jest.fn(),
    findByPk: jest.fn(),
  },
  Lote: {
    findAll: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  },
  Sequelize: {
    Op: {
      like: 'LIKE',
      ne: 'NE',
      in: 'IN',
    },
  },
}));

jest.mock('../../ValueObjects/productos.vo', () => {
  const state = { isValid: true, errors: [] };
  function ProductoVO(data) {
    this.nombre = data.nombre;
    this.presentacion = data.presentacion;
    this.idCategoria = data.idCategoria;
    this.categoriaText = data.categoriaText || data.categoria || data['categoría'];
    this.validate = () => ({ isValid: state.isValid, errors: state.errors });
  }
  ProductoVO.__setValidate = (valid, errors = []) => {
    state.isValid = valid;
    state.errors = errors;
  };
  return ProductoVO;
});

const db = require('../../Models');
const ProductoVO = require('../../ValueObjects/productos.vo');

describe('ProductoService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ProductoVO.__setValidate(true, []);
  });

  describe('getAll', () => {
    test('Given filters nombre & presentacion When getAll Then returns 200 with data', async () => {
      const p1 = {
        idProducto: 1,
        nombre: 'Manzana',
        presentacion: 'bolsa',
        toJSON: () => ({ idProducto: 1, nombre: 'Manzana', presentacion: 'bolsa' }),
      };
      const p2 = {
        idProducto: 2,
        nombre: 'Leche',
        presentacion: '1L',
        toJSON: () => ({ idProducto: 2, nombre: 'Leche', presentacion: '1L' }),
      };

      db.Producto.findAll.mockResolvedValue([p1, p2]);

      db.Lote.findAll.mockResolvedValue([
        { idProducto: 1, unidadesExistentes: 3 },
        { idProducto: 1, unidadesExistentes: 2 },
        { idProducto: 2, unidadesExistentes: 0 },
      ]);

      const result = await ProductoService.getAll({
        nombre: 'Manzana',
        presentacion: 'bolsa',
      });

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);

      expect(result.data).toEqual([
        { idProducto: 1, nombre: 'Manzana', presentacion: 'bolsa', cantidadTotal: 5 },
        { idProducto: 2, nombre: 'Leche', presentacion: '1L', cantidadTotal: 0 },
      ]);

      expect(db.Producto.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nombre: expect.any(Object),
            presentacion: expect.any(Object),
          }),
          include: expect.any(Array),
          order: expect.any(Array),
        })
      );

      expect(db.Lote.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            idProducto: expect.any(Object),
            activo: true,
          }),
          attributes: ['idProducto', 'unidadesExistentes'],
        })
      );
    });

    test('Given no results When getAll Then returns 200 with empty array', async () => {
      db.Producto.findAll.mockResolvedValue([]);
      db.Lote.findAll.mockResolvedValue([]);

      const result = await ProductoService.getAll({ nombre: 'X', presentacion: 'Y' });

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual([]);
    });
  });

  describe('getById', () => {
    test('Given existing id When getById Then returns 200 with product', async () => {
      const mockProduct = { idProducto: 10, nombre: 'Leche' };
      db.Producto.findByPk.mockResolvedValue(mockProduct);

      const result = await ProductoService.getById(10);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockProduct);
      expect(db.Producto.findByPk).toHaveBeenCalledWith(10, expect.any(Object));
    });

    test('Given not existing id When getById Then returns 404', async () => {
      db.Producto.findByPk.mockResolvedValue(null);

      const result = await ProductoService.getById(999);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });
  });

  describe('create', () => {
    const payload = {
      nombre: 'Manzana',
      presentacion: 'bolsa',
      categoriaText: 'Perecederos',
    };

    test('Given valid data and new category When create Then returns 201', async () => {
      db.Categoria.findOrCreate.mockResolvedValue([
        { idCategoria: 3, nombre: 'Perecederos' },
        true,
      ]);
      db.Producto.findOne.mockResolvedValue(null);
      db.Producto.create.mockResolvedValue({ idProducto: 123 });
      db.Producto.findByPk.mockResolvedValue({
        idProducto: 123,
        nombre: 'Manzana',
        presentacion: 'bolsa',
      });

      const result = await ProductoService.create(payload);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
      expect(db.Categoria.findOrCreate).toHaveBeenCalled();
      expect(db.Producto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Manzana',
          presentacion: 'bolsa',
          idCategoria: 3,
        })
      );
    });

    test('Given duplicate (same nombre & presentacion) When create Then returns 400', async () => {
      db.Producto.findOne.mockResolvedValue({ idProducto: 1 });

      const result = await ProductoService.create(payload);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
    });

    test('Given invalid data When create Then returns 400 with errors', async () => {
      ProductoVO.__setValidate(false, ['presentacion obligatoria']);

      const result = await ProductoService.create({
        nombre: 'Leche',
        presentacion: '',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.errors).toBeDefined();
    });
  });

  describe('getCantidadTotal', () => {
    test('Given active lots When getCantidadTotal Then sums and returns 200', async () => {
      db.Lote.findAll.mockResolvedValue([
        { unidadesExistentes: 4 },
        { unidadesExistentes: 6 },
      ]);

      const result = await ProductoService.getCantidadTotal(7);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 7, cantidadTotal: 10 });
      expect(db.Lote.findAll).toHaveBeenCalledWith({
        where: { idProducto: 7, activo: true },
        attributes: ['unidadesExistentes'],
      });
    });

    test('Given no active lots When getCantidadTotal Then returns 200 with 0', async () => {
      db.Lote.findAll.mockResolvedValue([]);

      const result = await ProductoService.getCantidadTotal(8);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 8, cantidadTotal: 0 });
    });
  });

  describe('getCaducidadMasProxima', () => {
    test('Given lots When getCaducidadMasProxima Then returns earliest date', async () => {
      const date = new Date('2026-01-10T00:00:00Z');
      db.Lote.findOne.mockResolvedValue({ caducidad: date });

      const result = await ProductoService.getCaducidadMasProxima(9);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 9, caducidad: date });
      expect(db.Lote.findOne).toHaveBeenCalledWith({
        where: { idProducto: 9, activo: true },
        order: [['caducidad', 'ASC']],
      });
    });

    test('Given no lots When getCaducidadMasProxima Then returns 200 with caducidad null', async () => {
      db.Lote.findOne.mockResolvedValue(null);

      const result = await ProductoService.getCaducidadMasProxima(9);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ idProducto: 9, caducidad: null });
    });
  });
});
