const EntradasService = require('../../Services/entradas.service');
const db = require('../../Models');

jest.mock('../../Models', () => ({
  Entrada: {
    create: jest.fn(),
  },
}));

describe('EntradasService - createEntrada Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given valid data, when createEntrada is called, then it should create an entry and return success', async () => {
    const entradaData = {
      proveedor: 'Proveedor de Prueba',
      fecha: '2025-10-26',
      idUsuario: 1,
      idTipo: 1,
      notas: 'Una nota',
    };

    const mockNuevaEntrada = { id: 1, ...entradaData };
    db.Entrada.create.mockResolvedValue(mockNuevaEntrada);

    const result = await EntradasService.createEntrada(entradaData);

    expect(db.Entrada.create).toHaveBeenCalledWith(entradaData);
    expect(result).toEqual({
      success: true,
      message: 'Entrada creada correctamente',
      data: mockNuevaEntrada,
      statusCode: 201
    });
  });

  test('Given the database fails, when createEntrada is called, then it should return an error', async () => {
    const entradaData = { proveedor: 'Proveedor Fallido' };
    const dbError = new Error('Error de conexión a la base de datos');
    db.Entrada.create.mockRejectedValue(dbError);

    const result = await EntradasService.createEntrada(entradaData);

    expect(db.Entrada.create).toHaveBeenCalledWith(entradaData);
    expect(result).toEqual({
      success: false,
      message: 'Error al crear entrada',
      error: dbError.message,
      statusCode: 400
    });
  });
});
