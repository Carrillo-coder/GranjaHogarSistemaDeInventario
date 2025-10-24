import { Platform } from 'react-native';

const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://10.34.18.74:5000' : 'http://127.0.0.1:5000';

const BASE = DEFAULT_BASE;

async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const SalidasProxyService = () => {

  async function getAllSalidas() {
    const url = `${BASE}/api/inventario/salidas`;
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new Error('No se pudo conectar al servidor: ' + err.message);
    }

    const body = await _parseBody(response);

    if (!response.ok) {
      const msg = body?.message || response.statusText || 'Error al obtener salidas';
      const err = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    return body.data || [];
  }

  /**
   * @param {Object} salida 
   */
  async function agregarSalida(salida) {
    const url = `${BASE}/api/inventario/salidas`;

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salida),
      });
    } catch (err) {
      throw new Error('No se pudo conectar al servidor: ' + err.message);
    }

    const body = await _parseBody(response);

    if (!response.ok) {
      const msg = body?.message || response.statusText || 'Error al agregar salida';
      const err = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    return body.data || {};
  }

  return { getAllSalidas, agregarSalida };
};

export default SalidasProxyService;
