const SalidasService = require('../../Services/salidas.service');
const db = require('../../Models');

jest.mock('../../Models', () => ({
  Salida: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe('SalidasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe crear una salida correctamente', async () => {
    const mockSalida = {
      id: 1,
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de fertilizante',
    };

    db.Salida.create.mockResolvedValue(mockSalida);

    const result = await SalidasService.createSalida({
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de fertilizante',
    });

    expect(result).toEqual({
      success: true,
      message: 'Salida creada correctamente',
      statusCode: 201,
      data: mockSalida,
    });

    expect(db.Salida.create).toHaveBeenCalledWith({
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de fertilizante',
    });
  });

  test('debe obtener todas las salidas correctamente', async () => {
    const mockSalidas = [
      {
        id: 1,
        idTipo: 2,
        idDepartamento: 3,
        idUsuario: 4,
        idProducto: 5,
        cantidad: 10,
        fecha: '2025-10-21',
        notas: 'Salida de alimento',
      },
      {
        id: 2,
        idTipo: 3,
        idDepartamento: 2,
        idUsuario: 1,
        idProducto: 8,
        cantidad: 20,
        fecha: '2025-10-22',
        notas: 'Salida de limpieza',
      },
    ];

    db.Salida.findAll.mockResolvedValue(mockSalidas);

    const result = await SalidasService.getAllSalidas();

    expect(result).toEqual({
      success: true,
      message: 'Salidas obtenidas correctamente',
      statusCode: 200,
      data: mockSalidas,
    });

    expect(db.Salida.findAll).toHaveBeenCalled();
  });
});
