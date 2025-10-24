import { Platform } from 'react-native';

const BASE = "http://192.168.1.66:5000";
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
  /**
   * Obtiene todas las salidas registradas
   */
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
   * Agrega una nueva salida
   * @param {Object} salida - { idProducto, cantidad, tipoSalida, idDepartamento, notas }
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
