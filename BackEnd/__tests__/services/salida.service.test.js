const SalidasService = require('../../Services/salidas.service');
const db = require('../../Models');

jest.mock('../../Models', () => ({
  Salida: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('SalidasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe crear una salida correctamente', async () => {
    const mockSalida = {
      idSalida: 1,
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de prueba',
    };

    db.Salida.create.mockResolvedValue(mockSalida);

    const result = await SalidasService.createSalida({
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de prueba',
    });

    expect(db.Salida.create).toHaveBeenCalledWith({
      idTipo: 2,
      idDepartamento: 3,
      idUsuario: 4,
      idProducto: 5,
      cantidad: 10,
      fecha: '2025-10-23',
      notas: 'Salida de prueba',
    });

    expect(result).toEqual({
      success: true,
      message: 'Salida creada correctamente',
      data: mockSalida,
      statusCode: 201,
    });
  });

  test('createSalida maneja error de creación', async () => {
    db.Salida.create.mockRejectedValue(new Error('Error al crear salida'));

    const result = await SalidasService.createSalida({
      idTipo: 1,
      idDepartamento: 1,
      idUsuario: 1,
      idProducto: 1,
      cantidad: 5,
    });

    expect(result).toEqual({
      success: false,
      message: 'Error al crear salida',
      error: 'Error al crear salida',
      statusCode: 400,
    });
  });

  test('debe obtener todas las salidas correctamente', async () => {
    const mockSalidas = [
      { idSalida: 1, cantidad: 10 },
      { idSalida: 2, cantidad: 5 },
    ];

    db.Salida.findAll.mockResolvedValue(mockSalidas);

    const result = await SalidasService.getAllSalidas();

    expect(db.Salida.findAll).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Salidas obtenidas correctamente',
      data: mockSalidas,
      statusCode: 200,
    });
  });

  test('getAllSalidas maneja error de consulta', async () => {
    db.Salida.findAll.mockRejectedValue(new Error('Error al obtener salidas'));

    const result = await SalidasService.getAllSalidas();

    expect(result).toEqual({
      success: false,
      message: 'Error al obtener salidas',
      error: 'Error al obtener salidas',
      statusCode: 500,
    });
  });

  test('getSalidaById retorna salida existente', async () => {
    const mockSalida = { idSalida: 1, cantidad: 10, idProducto: 5 };

    db.Salida.findByPk.mockResolvedValue(mockSalida);

    const result = await SalidasService.getSalidaById(1);

    expect(db.Salida.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      success: true,
      message: 'Salida encontrada',
      data: mockSalida,
      statusCode: 200,
    });
  });

  test('getSalidaById retorna 404 si no existe', async () => {
    db.Salida.findByPk.mockResolvedValue(null);

    const result = await SalidasService.getSalidaById(999);

    expect(db.Salida.findByPk).toHaveBeenCalledWith(999);
    expect(result).toEqual({
      success: false,
      message: 'Salida no encontrada',
      data: null,
      statusCode: 404,
    });
  });

  test('getSalidaById maneja error de consulta', async () => {
    db.Salida.findByPk.mockRejectedValue(new Error('Error en la consulta'));

    const result = await SalidasService.getSalidaById(1);

    expect(result).toEqual({
      success: false,
      message: 'Error al obtener salida por ID',
      error: 'Error en la consulta',
      statusCode: 500,
    });
  });
});
