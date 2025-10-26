// __tests__/alertas.controller.unit.js
const request = require('supertest');
const server = require('../../app'); // tu app Express
const AlertasService = require('../../Services/alertas.service');

jest.mock('../../Services/alertas.service', () => ({
  getPorCaducar: jest.fn(),
  getBajos: jest.fn(),
  getAltos: jest.fn(),
}));

describe('AlertasController (unit)', () => {
  afterAll(async () => {
    jest.clearAllMocks();
  });

  test('GET /api/inventario/alertas/por-caducar responde 200 con datos del servicio', async () => {
    AlertasService.getPorCaducar.mockResolvedValue({
      success: true,
      statusCode: 200,
      message: 'OK',
      data: [{ idProducto: 1, tipo: 'caducar' }],
    });

    const res = await request(server)
      .get('/api/inventario/alertas/por-caducar?dias=7')
      .expect(200);

    expect(AlertasService.getPorCaducar).toHaveBeenCalledWith(7);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  test('GET /api/inventario/alertas/bajos responde 200 con datos del servicio', async () => {
    AlertasService.getBajos.mockResolvedValue({
      success: true,
      statusCode: 200,
      message: 'OK',
      data: [{ idProducto: 2, tipo: 'bajo', cantidad: 3 }],
    });

    const res = await request(server)
      .get('/api/inventario/alertas/bajos?umbral=5')
      .expect(200);

    expect(AlertasService.getBajos).toHaveBeenCalledWith(5);
    expect(res.body.data[0].tipo).toBe('bajo');
  });

  test('GET /api/inventario/alertas/altos responde 200 con datos del servicio', async () => {
    AlertasService.getAltos.mockResolvedValue({
      success: true,
      statusCode: 200,
      message: 'OK',
      data: [{ idProducto: 3, tipo: 'alto', cantidad: 120 }],
    });

    const res = await request(server)
      .get('/api/inventario/alertas/altos?umbral=100')
      .expect(200);

    expect(AlertasService.getAltos).toHaveBeenCalledWith(100);
    expect(res.body.data[0].cantidad).toBe(120);
  });

  test('Errores inesperados del controlador -> 500', async () => {
    AlertasService.getPorCaducar.mockRejectedValue(new Error('boom'));

    const res = await request(server)
      .get('/api/inventario/alertas/por-caducar?dias=3')
      .expect(500);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Error interno del servidor/i);
  });
});
