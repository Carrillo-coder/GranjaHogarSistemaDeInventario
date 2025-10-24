process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app'); // import app, not server
const SalidasService = require('../../Services/salidas.service');

jest.mock('../../Services/salidas.service', () => ({
    generarReporteSalidas: jest.fn(),
}));

describe('Salidas Controller Tests', () => {
    afterAll(async () => {
        jest.clearAllMocks();
    });

    describe('getReporteSalidas', () => {
        test('Given missing fechaInicio When getReporteSalidas Then Error 400', async () => {
            const res = await request(app)
                .post('/api/inventario/salidas/reportes?departamento=0')
                .send({ fechaFin: '2025-10-20', formato: 'PDF' });
            expect(res.status).toBe(400);
            expect(res.body.errors).toContain('La fecha de inicio es obligatoria');
        });

        test('Given missing fechaFinal When getReporteSalidas Then Error 400', async () => {
            const res = await request(app)
                .post('/api/inventario/salidas/reportes?departamento=0')
                .send({ fechaInicio: '2025-10-01', formato: 'PDF' });
            expect(res.status).toBe(400);
            expect(res.body.errors).toContain('La fecha de fin es obligatoria');
        });

        test('Given missing formato When getReporteSalidas Then Error 400', async () => {
            const res = await request(app)
                .post('/api/inventario/salidas/reportes?departamento=0')
                .send({ fechaFin: '2025-10-20', fechaInicio: '2025-10-01' });
            expect(res.status).toBe(400);
            expect(res.body.errors).toContain('El formato es obligatorio');
        });

        test('Given missing departamento When getReporteSalidas Then Error 400', async () => {
            const res = await request(app)
                .post('/api/inventario/salidas/reportes')
                .send({ fechaFin: '2025-10-20', fechaInicio: '2025-10-01', formato: 'PDF' });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El parámetro "departamento" es obligatorio.');
        });

        test('Given valid request When getReporteSalidas Then returns 200 and report data', async () => {
            const mockBuffer = Buffer.from('fake_report_data');
            const mockFilename = 'reporte_salidas_test.pdf';
            SalidasService.generarReporteSalidas.mockResolvedValue({
                buffer: mockBuffer,
                filename: mockFilename,
            });

            const res = await request(app)
                .post('/api/inventario/salidas/reportes?departamento=0')
                .send({ fechaFin: '2025-10-20', fechaInicio: '2025-10-01', formato: 'PDF' });

            expect(res.status).toBe(200);
            expect(SalidasService.generarReporteSalidas).toHaveBeenCalledTimes(1);
            expect(res.body.success).toEqual(true);
        });
    });
});