// __tests__/alertas.service.unit.js
jest.useFakeTimers().setSystemTime(new Date('2025-10-26T10:00:00Z')); // fecha fija para diffDays

// Mock del módulo Models que usa el servicio
jest.mock('../../Models', () => {
  const fn = (...args) => ({ __fn: args });
  const col = (name) => ({ __col: name });
  const where = jest.fn((lhs, rhs) => ({ __where: [lhs, rhs] }));

  return {
    Sequelize: {
      Op: { between: 'between', lt: 'lt', gte: 'gte' },
      fn,
      col,
    },
    sequelize: { where },
    Lote: { findAll: jest.fn() },
    Producto: {}, // no se usa directo en tests, va por include
  };
});

const db = require('../../Models');
const AlertasService = require('../../Services/alertas.service');

// Util para construir filas tipo Sequelize
function makeRow({ idProducto, caducidad, stock, producto }) {
  return {
    idProducto,
    producto,
    get: (k) => {
      if (k === 'caducidad') return caducidad ?? null;
      if (k === 'stock') return stock ?? null;
      return undefined;
    },
  };
}

describe('AlertasService - getPorCaducar', () => {
  beforeEach(() => {
    db.Lote.findAll.mockReset();
  });

  test('Devuelve lista con productos por caducar dentro del rango', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 1,
        caducidad: new Date('2025-10-28T00:00:00Z'),
        producto: { nombre: 'Leche', presentacion: '1L' },
      }),
      makeRow({
        idProducto: 2,
        caducidad: new Date('2025-10-30T00:00:00Z'),
        producto: { nombre: 'Yogur', presentacion: '500ml' },
      }),
    ]);

    const res = await AlertasService.getPorCaducar(10);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.data).toHaveLength(2);

    // Validaciones puntuales
    expect(res.data[0].tipo).toBe('caducar');
    expect(typeof res.data[0].diasRestantes).toBe('number');
  });

  test('Sin resultados -> mensaje de no hay productos', async () => {
    db.Lote.findAll.mockResolvedValue([]);
    const res = await AlertasService.getPorCaducar(5);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.data).toHaveLength(0);
    expect(res.message).toMatch(/No hay productos por caducar/i);
  });

  test('Error en BD -> status 500', async () => {
    db.Lote.findAll.mockRejectedValue(new Error('Falla DB'));
    const res = await AlertasService.getPorCaducar(5);
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(500);
    expect(res.message).toMatch(/Error al obtener productos por caducar/i);
  });
});

describe('AlertasService - getBajos', () => {
  beforeEach(() => {
    db.Lote.findAll.mockReset();
  });

  test('Devuelve productos bajos en inventario', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 3,
        stock: 4,
        producto: { nombre: 'Huevos', presentacion: 'Caja' },
      }),
    ]);

    const res = await AlertasService.getBajos(10);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].tipo).toBe('bajo');
    expect(res.data[0].cantidad).toBe(4);
  });

  test('Sin resultados -> mensaje de no hay productos por debajo', async () => {
    db.Lote.findAll.mockResolvedValue([]);
    const res = await AlertasService.getBajos(10);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.message).toMatch(/No hay productos por debajo del umbral/i);
  });

  test('Error en BD -> status 500', async () => {
    db.Lote.findAll.mockRejectedValue(new Error('Falla DB'));
    const res = await AlertasService.getBajos(10);
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(500);
    expect(res.message).toMatch(/Error al obtener productos bajos/i);
  });
});

describe('AlertasService - getAltos', () => {
  beforeEach(() => {
    db.Lote.findAll.mockReset();
  });

  test('Devuelve productos altos en inventario', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 5,
        stock: 150,
        producto: { nombre: 'Maíz', presentacion: 'Saco' },
      }),
    ]);

    const res = await AlertasService.getAltos(100);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].tipo).toBe('alto');
    expect(res.data[0].cantidad).toBe(150);
  });

  test('Sin resultados -> mensaje de no hay productos por encima', async () => {
    db.Lote.findAll.mockResolvedValue([]);
    const res = await AlertasService.getAltos(200);
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.message).toMatch(/No hay productos por encima del umbral/i);
  });

  test('Error en BD -> status 500', async () => {
    db.Lote.findAll.mockRejectedValue(new Error('Falla DB'));
    const res = await AlertasService.getAltos(100);
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(500);
    expect(res.message).toMatch(/Error al obtener productos altos/i);
  });
});
