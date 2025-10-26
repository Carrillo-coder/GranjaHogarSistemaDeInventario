const LoginService = require('../../Services/logIn.service');
const usuariosService = require('../../Services/usuarios.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../Services/usuarios.service');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('LoginService unit tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('logIn', () => {

        test('Given valid credentials When logIn Then returns success with token', async () => {
            const mockUser = {
                idUsuario: 1,
                nombreUsuario: 'testuser',
                nombreCompleto: 'Test User',
                password: 'hashedpassword',
                rol: { nombre: 'Admin' }
            };

            usuariosService.getUsuarioByUserName.mockResolvedValue({
                success: true,
                data: mockUser
            });

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock-jwt-token');

            const result = await LoginService.logIn('testuser', 'password123');

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data.token).toBe('mock-jwt-token');
            expect(result.data.usuario).toEqual({
                idUsuario: mockUser.idUsuario,
                nombreUsuario: mockUser.nombreUsuario,
                nombreCompleto: mockUser.nombreCompleto,
                rol: mockUser.rol.nombre
            });
        });

        test('Given non-existent user When logIn Then returns 404', async () => {
            usuariosService.getUsuarioByUserName.mockResolvedValue({
                success: false,
                data: null
            });

            const result = await LoginService.logIn('nonexistentuser', 'password123');

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe('Usuario no encontrado');
        });

        test('Given incorrect password When logIn Then returns 404', async () => {
            const mockUser = {
                idUsuario: 1,
                nombreUsuario: 'testuser',
                nombreCompleto: 'Test User',
                password: 'hashedpassword',
                rol: { nombre: 'Admin' }
            };

            usuariosService.getUsuarioByUserName.mockResolvedValue({
                success: true,
                data: mockUser
            });

            bcrypt.compare.mockResolvedValue(false);

            const result = await LoginService.logIn('testuser', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe('Contraseña incorrecta');
        });

        test('Given service error When logIn Then returns 400', async () => {
            usuariosService.getUsuarioByUserName.mockRejectedValue(new Error('Service error'));

            const result = await LoginService.logIn('testuser', 'password123');

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('Error al iniciar sesión');
            expect(result.error).toBe('Service error');
        });
    });
});