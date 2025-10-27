process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app'); // import app, not server
const EntradasService = require('../../Services/entradas.service');

jest.mock('../../Services/entradas.service', () => ({
  generarReporteEntradas: jest.fn(),
}));

describe('Entradas Controller Tests', () => {
  afterAll(async () => {
    jest.clearAllMocks();
  });

  describe('getReporteEntradas', () => {

    test('Given missing fechaInicio When getReporteEntradas Then Error 400', async () => {
      const res = await request(app)
        .post('/api/inventario/entradas/reportes')
        .send({ fechaFin: '2025-10-20', formato: 'PDF' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('La fecha de inicio es obligatoria');
    });

    test('Given missing fechaFinal When getReporteEntradas Then Error 400', async () => {
      const res = await request(app)
        .post('/api/inventario/entradas/reportes')
        .send({ fechaInicio: '2025-10-01', formato: 'PDF' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('La fecha de fin es obligatoria');
    });

    test('Given missing formato When getReporteEntradas Then Error 400', async () => {
      const res = await request(app)
        .post('/api/inventario/entradas/reportes')
        .send({ fechaFin: '2025-10-20', fechaInicio: '2025-10-01' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('El formato es obligatorio');
    });

    test('Given valid request When getReporteEntradas Then returns 200 and report data', async () => {
      const mockBuffer = Buffer.from('fake_report_data');
      const mockFilename = 'reporte_entradas_test.pdf';
      EntradasService.generarReporteEntradas.mockResolvedValue({
        buffer: mockBuffer,
        filename: mockFilename,
      });

      const res = await request(app)
        .post('/api/inventario/entradas/reportes')
        .send({
          fechaInicio: '2025-10-01',
          fechaFin: '2025-10-10',
          formato: 'PDF',
        });

      expect(res.status).toBe(200);
      expect(EntradasService.generarReporteEntradas).toHaveBeenCalledTimes(1);
      expect(res.body.success).toBe(true);
    });
  });
});
