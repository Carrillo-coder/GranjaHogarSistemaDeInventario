process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app'); // import app, not server
const LotesService = require('../../Services/lotes.service');

jest.mock('../../Services/lotes.service', () => ({
  generarReporteLotes: jest.fn(),
}));

describe('Lotes Controller Tests', () => {
    afterAll(async () => {
        jest.clearAllMocks();
    });

    describe('getReporteLotes', () => {
        test('Given invalid formato When getReporteLotes Then Error 400', async () => {
            const res = await request(app)
                .get('/api/inventario/lotes/reportes?formato=TXT');
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('El formato debe ser XLSX o PDF.');
        });

        test('Given missing formato When getReporteLotes Then Error 400', async () => {
            const res = await request(app)
                .get('/api/inventario/lotes/reportes');
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('El parámetro "formato" es obligatorio.');
        });

        test('Given valid formato When getReporteLotes Then returns 200 and report data', async () => {
            const mockBuffer = Buffer.from('fake_report_data');
            const mockFilename = 'reporte_lotes_test.pdf';
            LotesService.generarReporteLotes.mockResolvedValue({
                buffer: mockBuffer,
                filename: mockFilename,
            });

            const res = await request(app)
                .get('/api/inventario/lotes/reportes?formato=PDF');

            expect(res.status).toBe(200);
            expect(LotesService.generarReporteLotes).toHaveBeenCalledTimes(1);
            expect(res.body.success).toEqual(true);
        });
    });
});