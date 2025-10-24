// import { API_BASE_URL as BASE } from '@env';
const BASE = "http://10.34.18.73:5000";

async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { message: text }; }
}

const SalidasProxyService = () => {
  async function getAllSalidas() {
    const url = `${BASE}/api/inventario/salidas`;
    const res = await fetch(url);
    const body = await _parseBody(res);
    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al obtener salidas';
      const err = new Error(msg); err.status = res.status; err.body = body; throw err;
    }
    return body.data || [];
  }

  // POST UNA salida (por compatibilidad)
  async function agregarSalida(salida) {
    const url = `${BASE}/api/inventario/salidas`;
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(salida),
    });
    const body = await _parseBody(res);
    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al agregar salida';
      const err = new Error(msg); err.status = res.status; err.body = body; throw err;
    }
    return body.data || {};
  }

  // ✅ POST LOTE de salidas (array) — preferido
  async function agregarSalidasLote(salidasArray) {
    const url = `${BASE}/api/inventario/salidas`;
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(salidasArray),
    });
    const body = await _parseBody(res);
    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al agregar salidas';
      const err = new Error(msg); err.status = res.status; err.body = body; throw err;
    }
    // backend responde { message, salidas } en éxito de lote
    return body.salidas || body.data || [];
  }

  return { getAllSalidas, agregarSalida, agregarSalidasLote };
};

export default SalidasProxyService;
