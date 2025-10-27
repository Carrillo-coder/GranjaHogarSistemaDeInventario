const LotesService = require('../../Services/lotes.service');
const db = require('../../Models');

jest.mock('../../Models', () => ({
  Lote: {
    create: jest.fn(),
  },
  Producto: {
    findByPk: jest.fn(),
  },
}));

describe('LotesService - createLote Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given valid data, when createLote is called, then it should create a lote and return success', async () => {
    const loteData = {
      idProducto: 1,
      idEntrada: 100,
      cantidad: 50,
      unidadesExistentes: 50,
      caducidad: '2026-01-01',
      activo: true,
    };
    const mockProducto = { id: 1, nombre: 'Producto Existente' };
    const mockNuevoLote = { id: 500, ...loteData };

    db.Producto.findByPk.mockResolvedValue(mockProducto);
    db.Lote.create.mockResolvedValue(mockNuevoLote);

    const result = await LotesService.createLote(loteData);

    expect(db.Producto.findByPk).toHaveBeenCalledWith(loteData.idProducto);
    expect(db.Lote.create).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Lote creado correctamente',
      data: mockNuevoLote,
      statusCode: 201
    });
  });

  test('Given missing idProducto, when createLote is called, then it should return error 400', async () => {
    const loteData = { idEntrada: 100, cantidad: 10 };

    const result = await LotesService.createLote(loteData);

    expect(db.Lote.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: 'idProducto e idEntrada son obligatorios',
      statusCode: 400
    });
  });

  test('Given a non-existent producto, when createLote is called, then it should return error 400', async () => {
    const loteData = { idProducto: 999, idEntrada: 100, cantidad: 10 };
    db.Producto.findByPk.mockResolvedValue(null);

    const result = await LotesService.createLote(loteData);

    expect(db.Producto.findByPk).toHaveBeenCalledWith(loteData.idProducto);
    expect(db.Lote.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: 'El producto asociado no existe',
      statusCode: 400
    });
  });

  test('Given database fails on create, when createLote is called, then it should return a generic error', async () => {
    const loteData = { idProducto: 1, idEntrada: 100, cantidad: 10 };
    const dbError = new Error('DB connection lost');
    db.Producto.findByPk.mockResolvedValue({ id: 1 });
    db.Lote.create.mockRejectedValue(dbError);

    const result = await LotesService.createLote(loteData);

    expect(result).toEqual({
      success: false,
      message: 'Error al crear lote',
      error: dbError.message,
      statusCode: 400
    });
  });
});
