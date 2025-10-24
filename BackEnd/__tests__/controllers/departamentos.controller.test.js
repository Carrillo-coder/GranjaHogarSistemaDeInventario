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
            const res = await request(app)
                .get('/api/inventario/departamentos');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
