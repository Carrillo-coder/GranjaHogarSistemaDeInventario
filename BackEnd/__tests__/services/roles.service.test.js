const RolService = require('../../Services/roles.service');

jest.mock('../../Models', () => ({
    Rol: {
        findAll: jest.fn()
    }
}));

const db = require('../../Models');

describe("RolService unit tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllRoles", () => {

        test('Given roles in database When getAllRoles Then returns success with data', async () => {
            const mockRoles = [
                { idRol: 1, nombre: 'Admin' },
                { idRol: 2, nombre: 'Cocina' },
                { idRol: 3, nombre: 'Comedor' }
            ];
            db.Rol.findAll.mockResolvedValue(mockRoles);

            const result = await RolService.getAllRoles();

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual(mockRoles);
        });

        test('Given no roles in database When getAllRoles Then returns 204', async () => {
            db.Rol.findAll.mockResolvedValue([]);

            const result = await RolService.getAllRoles();

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(204);
        });
    });
});