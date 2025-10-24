
//import { API_BASE_URL as BASE } from '@env';
const BASE = "http://192.168.1.66:5000";
import { Platform } from 'react-native';

async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const ProductosListaProxy = () => {
  /**

   * @returns {Promise<Array>} 
   */
  async function getAllProductos() {
    const url = `${BASE}/api/inventario/productos`;
    const response = await fetch(url, { method: 'GET' });

    const body = await _parseBody(response);

    if (!response.ok) {
      const msg = body?.message || response.statusText || 'Error al obtener productos';
      const err = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    return body.data || [];
  }

  return { getAllProductos };
};

export default ProductosListaProxy;
