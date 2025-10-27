const DepartamentosService = require('../../Services/departamentos.service');

jest.mock('../../Models', () => ({
    Departamento: {
        findAll: jest.fn()
    }
}));

const db = require('../../Models');

describe("DepartamentosService Unit tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllDepartamentos", () => {

        test("Given departamentos in database When getAll Then returns success with data", async () => {
            const mockDepartamentos = [
                { idDepartamento: 1, nombre: 'Almacén central' },
                { idDepartamento: 2, nombre: 'Tienda principal' },
                { idDepartamento: 3, nombre: 'Oficina' }
            ];
            db.Departamento.findAll.mockResolvedValue(mockDepartamentos);

            const result = await DepartamentosService.getAllDepartamentos();

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual(mockDepartamentos);
        });

        test("Given no departamentos in database When getAll Then returns 204", async () => {
            db.Departamento.findAll.mockResolvedValue([]);
            const result = await DepartamentosService.getAllDepartamentos();
            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(204);
        });
    });
});
