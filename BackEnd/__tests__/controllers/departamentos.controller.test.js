process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app'); // import app, not server
const DepartamentosService = require('../../Services/departamentos.service');

jest.mock('../../Services/departamentos.service', () => ({
    getAllDepartamentos: jest.fn(),
}));

describe('Departamentos Controller Tests', () => {
    afterAll(async () => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        test('Given departamentos in database When getAll Then returns 200 and data', async () => {
            DepartamentosService.getAllDepartamentos.mockResolvedValue({
                statusCode: 200,
                success: true,
                data: [
                    { idDepartamento: 1, nombre: 'Sistemas' },
                    { idDepartamento: 2, nombre: 'Mecatrónica' }
                ],
            });

            const res = await request(app)
                .get('/api/inventario/departamentos');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test('Given no departamentos in database When getAll Then returns 204', async () => {
            DepartamentosService.getAllDepartamentos.mockResolvedValue({
                statusCode: 204,
                success: false,
            });
            const res = await request(app)
                .get('/api/inventario/departamentos');
            expect(res.statusCode).toBe(204);
        });
    });
});
