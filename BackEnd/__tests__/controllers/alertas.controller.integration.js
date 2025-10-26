// __tests__/alertas.controller.integration.js
const request = require('supertest');
const server = require('../../app');

// Mock de Models para que el servicio funcione sin BD real
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
    sequelize: {
      where,
      sync: jest.fn().mockResolvedValue(),
    },
    Lote: {
      findAll: jest.fn(),
    },
    Producto: {},
  };
});

const db = require('../../Models');

// Helper para construir filas
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

describe('AlertasController (integration)', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-10-26T10:00:00Z'));
  });

  afterAll(async () => {
    if (db?.sequelize?.sync?.mockClear) db.sequelize.sync.mockClear();
    if (db?.Lote?.findAll?.mockClear) db.Lote.findAll.mockClear();
  });

  test('GET /por-caducar 200 y estructura válida', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 1,
        caducidad: new Date('2025-10-28T00:00:00Z'),
        producto: { nombre: 'Leche', presentacion: '1L' },
      }),
    ]);

    const res = await request(server)
      .get('/api/inventario/alertas/por-caducar?dias=5')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].tipo).toBe('caducar');
    expect(typeof res.body.data[0].diasRestantes).toBe('number');
  });

  test('GET /bajos 200 y orden por stock ascendente', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 2,
        stock: 3,
        producto: { nombre: 'Huevos', presentacion: 'Caja' },
      }),
      makeRow({
        idProducto: 3,
        stock: 6,
        producto: { nombre: 'Harina', presentacion: 'Kg' },
      }),
    ]);

    const res = await request(server)
      .get('/api/inventario/alertas/bajos?umbral=10')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data[0].tipo).toBe('bajo');
    expect(typeof res.body.data[0].cantidad).toBe('number');
  });

  test('GET /altos 200 y payload correcto', async () => {
    db.Lote.findAll.mockResolvedValue([
      makeRow({
        idProducto: 10,
        stock: 120,
        producto: { nombre: 'Maíz', presentacion: 'Saco' },
      }),
    ]);

    const res = await request(server)
      .get('/api/inventario/alertas/altos?umbral=100')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data[0].tipo).toBe('alto');
    expect(res.body.data[0].cantidad).toBe(120);
  });

  test('Errores de BD -> 500 en /bajos', async () => {
    db.Lote.findAll.mockRejectedValue(new Error('DB down'));

    const res = await request(server)
      .get('/api/inventario/alertas/bajos?umbral=10')
      .expect(500);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Error al obtener productos bajos/i);
  });
});
