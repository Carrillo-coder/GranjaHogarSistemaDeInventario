const SalidaController = require('../../Controllers/salidas.controller');
const SalidasService = require('../../Services/salidas.service');
const db = require('../../Models');
const { Salida } = db;


const mockRequest = (body = {}, query = {}, params = {}) => ({ body, query, params });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

describe('SalidaController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllSalidas retorna todas las salidas', async () => {
    Salida.findAll = jest.fn().mockResolvedValue([
      { idSalida: 1, cantidad: 10 },
      { idSalida: 2, cantidad: 5 },
    ]);

    const req = mockRequest();
    const res = mockResponse();

    await SalidaController.getAllSalidas(req, res);

    expect(Salida.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { idSalida: 1, cantidad: 10 },
      { idSalida: 2, cantidad: 5 },
    ]);
  });

  test('getSalidaById retorna 404 si no existe', async () => {
    Salida.findByPk = jest.fn().mockResolvedValue(null);

    const req = mockRequest({}, {}, { id: 999 });
    const res = mockResponse();

    await SalidaController.getSalidaById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Salida no encontrada' });
  });

});
