import { API_BASE_URL } from '@env';
import { Platform } from 'react-native';

const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const BASE = (API_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/+$/, ''); // sin slash final

async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const ProductosDetallesProxy = () => {
  // GET /api/inventario/productos/:id
  async function getById(id) {
    const url = `${BASE}/api/inventario/productos/${id}`;
    const res = await fetch(url, { method: 'GET' });
    const body = await _parseBody(res);

    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al obtener producto';
      const err = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    // backend devuelve { success, message, data: { ... } }
    return body.data || null;
  }

  // GET /api/inventario/productos/:id/cantidad
  async function getCantidad(id) {
    const url = `${BASE}/api/inventario/productos/${id}/cantidad`;
    const res = await fetch(url, { method: 'GET' });
    const body = await _parseBody(res);

    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al obtener cantidad';
      const err = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    // asumiendo response { success, message, data: { idProducto, cantidadTotal } }
    return body.data || null;
  }

  // GET /api/inventario/productos/:id/caducidad
  async function getCaducidad(id) {
    const url = `${BASE}/api/inventario/productos/${id}/caducidad`;
    const res = await fetch(url, { method: 'GET' });
    const body = await _parseBody(res);

    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al obtener caducidad';
      const err = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    // asumiendo response { success, message, data: { idProducto, caducidad } }
    return body.data || null;
  }

  return { getById, getCantidad, getCaducidad };
};

export default ProductosDetallesProxy;
