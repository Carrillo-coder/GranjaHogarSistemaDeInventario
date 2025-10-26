const request = require('supertest');
const app = require('../../app');
const LoginService = require('../../Services/logIn.service');

jest.mock('../../Services/logIn.service');

describe('LogIn Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Given valid credentials When handleLogIn Then Status 200 and Token', async () => {
    const mockUsername = 'testuser';
    const mockPassword = 'password123';
    const mockUserData = {
      idUsuario: 1,
      nombreUsuario: 'testuser',
      nombreCompleto: 'Test User',
      rol: 'Admin'
    };
    const mockToken = 'mock-jwt-token';

    LoginService.logIn.mockResolvedValue({
      success: true,
      data: {
        usuario: mockUserData,
        token: mockToken
      }
    });

    return request(app)
      .post(`/api/inventario/logIn/${mockUsername}`)
      .send({ password: mockPassword })
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Inicio de sesión exitoso');
        expect(response.body.token).toBe(mockToken);
        expect(response.body.data).toEqual({
          id: mockUserData.idUsuario,
          nombreUsuario: mockUserData.nombreUsuario,
          nombreCompleto: mockUserData.nombreCompleto,
          rol: mockUserData.rol
        });
        expect(LoginService.logIn).toHaveBeenCalledWith(mockUsername, mockPassword);
      });
  });

  test('Given invalid credentials When handleLogIn Then Status 401', async () => {
    const mockUsername = 'testuser';
    const mockPassword = 'wrongpassword';

    LoginService.logIn.mockResolvedValue({
      success: false,
      statusCode: 401,
      message: 'Contraseña incorrecta'
    });

    return request(app)
      .post(`/api/inventario/logIn/${mockUsername}`)
      .send({ password: mockPassword })
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Contraseña incorrecta');
      });
  });

  test('Given non-existent user When handleLogIn Then Status 404', async () => {
    const mockUsername = 'nonexistentuser';
    const mockPassword = 'password123';

    LoginService.logIn.mockResolvedValue({
      success: false,
      statusCode: 404,
      message: 'Usuario no encontrado'
    });

    return request(app)
      .post(`/api/inventario/logIn/${mockUsername}`)
      .send({ password: mockPassword })
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Usuario no encontrado');
      });
  });

  test('Given missing password When handleLogIn Then Status 400', async () => {
    const mockUsername = 'testuser';

    return request(app)
      .post(`/api/inventario/logIn/${mockUsername}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Nombre de usuario y contraseña son requeridos');
      });
  });

  test('Given service error When handleLogIn Then Status 500', async () => {
    const mockUsername = 'testuser';
    const mockPassword = 'password123';
    const errorMessage = 'Error interno del servicio';

    LoginService.logIn.mockRejectedValue(new Error(errorMessage));

    return request(app)
      .post(`/api/inventario/logIn/${mockUsername}`)
      .send({ password: mockPassword })
      .expect(500)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error interno del servidor');
        expect(response.body.error).toBe(errorMessage);
      });
  });
});
