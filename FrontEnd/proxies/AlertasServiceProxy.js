// proxies/AlertasServiceProxy.js
import { AlertaVO } from '../valueobjects/AlertaVO';

const API_BASE_URL = "http://192.168.0.16:5000";
const baseRoot = API_BASE_URL.replace(/\/+$/, '');
const base = `${baseRoot}/api/inventario/alertas`;

async function _handle(res) {
  if (res.status === 204) return { success: true, data: [] };
  const raw = await res.text().catch(() => '');
  const json = (() => {
    if (!raw || raw.trim() === '') return {};
    try { return JSON.parse(raw); } catch { return null; }
  })();

  if (!res.ok) {
    const snippet = raw?.slice(0, 200) || '(sin cuerpo)';
    const msgFromJson = json && (json.message || json.error);
    const generic =
      res.status === 400 ? 'Solicitud invÃ¡lida' :
      res.status === 404 ? 'No encontrado' :
      res.status === 500 ? 'Error del servidor' :
      `HTTP ${res.status}`;
    throw new Error(`${generic}. Detalle: ${msgFromJson || snippet}`);
  }
  if (json === null) {
    const snippet = raw?.slice(0, 200) || '(sin cuerpo)';
    throw new Error(`La respuesta no es JSON vÃ¡lido. Recibido: ${snippet}`);
  }
  return json;
}

function createAlertasServiceProxy() {
  const getPorCaducar = async (dias = 10, signal) => {
    const res = await fetch(`${base}/por-caducar?dias=${encodeURIComponent(dias)}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  };

  const getBajos = async (umbral = 10, signal) => {
    const res = await fetch(`${base}/bajos?umbral=${encodeURIComponent(umbral)}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  };

  const getAltos = async (umbral = 100, signal) => {
    const res = await fetch(`${base}/altos?umbral=${encodeURIComponent(umbral)}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  };

  return { getPorCaducar, getBajos, getAltos };
}

const AlertasServiceProxy = createAlertasServiceProxy();
export default AlertasServiceProxy;
