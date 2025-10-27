// import { API_BASE_URL as BASE } from '@env';
const BASE = "http://192.168.1.67:5000";

async function _parseBody(res) {
  const text = await res.text().catch(() => '');
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { message: text }; }
}

const TiposSalidasServiceProxy = () => {
  async function getAll() {
    const url = `${BASE}/api/inventario/tiposSalidas`;
    const res = await fetch(url, { method: 'GET' });
    const body = await _parseBody(res);
    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al obtener tipos de salidas';
      const err = new Error(msg); err.status = res.status; err.body = body; throw err;
    }
    // El VO suele devolver { idTipoS, nombre }, lo respetamos
    return Array.isArray(body.data) ? body.data : [];
  }

  return { getAll };
};

export default TiposSalidasServiceProxy;
