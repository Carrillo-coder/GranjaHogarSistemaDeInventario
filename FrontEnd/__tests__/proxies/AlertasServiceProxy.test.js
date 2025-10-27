// __tests__/proxies/AlertasServiceProxy.test.js
import AlertasServiceProxy from '../../proxies/AlertasServiceProxy';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de AlertaVO.fromApi para no depender de su implementación
jest.mock('../../valueobjects/AlertaVO', () => ({
  AlertaVO: {
    fromApi: jest.fn((x) => ({ ...x, __mapped: true })),
  },
}));

const { AlertaVO } = require('../../valueobjects/AlertaVO');

describe('AlertasServiceProxy', () => {
  beforeEach(() => {
    fetch.mockReset();
    AlertaVO.fromApi.mockClear();
  });

  test('getPorCaducar retorna lista mapeada', async () => {
    // GIVEN
    const payload = { success: true, data: [{ idProducto: 1, tipo: 'caducar', diasRestantes: 3 }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(payload),
    });

    // WHEN
    const result = await AlertasServiceProxy.getPorCaducar(7);

    // THEN
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/inventario\/alertas\/por-caducar\?dias=7$/),
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    expect(Array.isArray(result)).toBe(true);
    expect(AlertaVO.fromApi).toHaveBeenCalledTimes(1);
    expect(result[0]).toMatchObject({ idProducto: 1, __mapped: true });
  });

  test('getBajos maneja 204 como []', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: async () => '',
    });

    const result = await AlertasServiceProxy.getBajos(5);
    expect(result).toEqual([]); // sin map porque data = []
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/inventario\/alertas\/bajos\?umbral=5$/),
      expect.any(Object)
    );
  });

  test('getAltos retorna lista mapeada', async () => {
    const payload = { success: true, data: [{ idProducto: 10, tipo: 'alto', cantidad: 120 }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(payload),
    });

    const result = await AlertasServiceProxy.getAltos(100);
    expect(result[0]).toMatchObject({ idProducto: 10, __mapped: true });
  });

  test('Error 400 propaga mensaje genérico con detalle', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: 'Solicitud inválida en servidor' }),
    });

    await expect(AlertasServiceProxy.getBajos(10))
      .rejects.toThrow(/Solicitud inválida/i);
  });

  test('Error 500 propaga mensaje', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: 'Falla interna' }),
    });

    await expect(AlertasServiceProxy.getAltos(100))
      .rejects.toThrow(/Error del servidor/i);
  });

  test('Respuesta no-JSON válido lanza error', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '<<html>no json</html>',
    });

    await expect(AlertasServiceProxy.getPorCaducar(10))
      .rejects.toThrow(/no es JSON válido/i);
  });

  test('AbortController (signal) corta la petición', async () => {
    // Simulamos rechazo por abort
    const abortErr = new DOMException('The operation was aborted.', 'AbortError');
    fetch.mockRejectedValueOnce(abortErr);

    const ac = new AbortController();
    const p = AlertasServiceProxy.getPorCaducar(10, ac.signal);
    ac.abort();

    await expect(p).rejects.toThrow(/aborted|Abort/i);
  });
});
