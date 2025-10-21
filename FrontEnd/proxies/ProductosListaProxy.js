
import { API_BASE_URL } from '@env';
import { Platform } from 'react-native';

const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://10.34.18.74:5000' : 'http://localhost:5000';

const BASE = (API_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/+$/, '');

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
   * Obtiene todos los productos desde el backend.
   * @returns {Promise<Array>} - Lista de productos
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

    // asumimos que el backend devuelve { data: [ {Nombre, idProducto, ...} ] }
    return body.data || [];
  }

  return { getAllProductos };
};

export default ProductosListaProxy;
