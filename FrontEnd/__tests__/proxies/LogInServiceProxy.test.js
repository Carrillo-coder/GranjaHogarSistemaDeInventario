import LogInServiceProxy from '../../proxies/LogInServiceProxy';

global.fetch = jest.fn();

describe('LogInServiceProxy unit tests', () => {
  const { logInUser } = LogInServiceProxy();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given valid credentials When logInUser Then returns user data', async () => {
    const mockResponse = {
      id: 1,
      nombreUsuario: 'testuser',
      nombreCompleto: 'Test User',
      rol: 'Admin',
      token: 'mock-jwt-token'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse))
    });

    const result = await logInUser('testuser', 'password123');

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/inventario/logIn/testuser'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'password123' })
      })
    );
  });

  test('Given invalid credentials When logInUser Then throws error with 401', async () => {
    const mockErrorResponse = {
      message: 'Contraseña incorrecta'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse))
    });

    await expect(logInUser('testuser', 'wrongpassword')).rejects.toThrow('Contraseña incorrecta');
    expect(fetch).toHaveBeenCalled();
  });

  test('Given non-existent user When logInUser Then throws error with 404', async () => {
    const mockErrorResponse = {
      message: 'Usuario no encontrado'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse))
    });

    await expect(logInUser('nonexistentuser', 'password123')).rejects.toThrow('Usuario no encontrado');
    expect(fetch).toHaveBeenCalled();
  });

  test('Given server error When logInUser Then throws error with 500', async () => {
    const mockErrorResponse = {
      message: 'Error interno del servidor'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockErrorResponse))
    });

    await expect(logInUser('testuser', 'password123')).rejects.toThrow('Error interno del servidor');
    expect(fetch).toHaveBeenCalled();
  });

  test('Given unexpected error When logInUser Then throws generic error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(logInUser('testuser', 'password123')).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalled();
  });
});