import { API_BASE_URL } from '@env';
import { Platform } from 'react-native';

const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

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

const ProductosServiceProxy = () => {
  async function crearProducto(payload) {
    const url = `${BASE}/api/inventario/productos`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await _parseBody(response);

    if (!response.ok) {
      const msg = body?.message || response.statusText || 'Error del servidor';
      const err = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }
    
    return body;
  }

  return { crearProducto };
};

export default ProductosServiceProxy;
