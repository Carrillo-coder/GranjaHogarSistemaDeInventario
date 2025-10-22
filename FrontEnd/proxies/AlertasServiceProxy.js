// proxies/AlertasServiceProxy.js
import { AlertaVO } from '../valueobjects/AlertaVO';
import { API_BASE_URL as API_BASE_URL } from '@env'; // puede venir undefined

const AlertasServiceProxy = () => {
  const base = `${API_BASE_URL.replace(/\/+$/, '')}/api/inventario/alertas`;

  async function _handle(res) {
    // 204 No Content → no intentes parsear JSON
    if (res.status === 204) {
      return { success: true, data: [] };
    }

    const raw = await res.text(); // lee texto crudo primero
    // Intentar JSON solo si hay contenido
    const tryParse = () => {
      if (!raw || raw.trim() === '') return {};
      try { return JSON.parse(raw); } catch { return null; }
    };

    const json = tryParse();

    if (!res.ok) {
      // Si el server devolvió JSON con mensaje, úsalo; si no, muestra fragmento del body crudo
      const snippet = raw?.slice(0, 200) || '(sin cuerpo)';
      const msgFromJson = json && (json.message || json.error);
      const generic =
        res.status === 400 ? 'Solicitud inválida' :
        res.status === 404 ? 'No encontrado' :
        res.status === 500 ? 'Error del servidor' :
        'Error desconocido';

      throw new Error(`${generic} (HTTP ${res.status}). Detalle: ${msgFromJson || snippet}`);
    }

    if (json === null) {
      // 200 pero la respuesta no es JSON válido
      const snippet = raw?.slice(0, 200) || '(sin cuerpo)';
      throw new Error(`La respuesta no es JSON válido. Recibido: ${snippet}`);
    }

    return json;
  }

  async function getPorCaducar(dias = 10) {
    const url = `${base}/por-caducar?dias=${encodeURIComponent(dias)}`;
    // Opcional: log para depurar
    // console.log('GET', url);
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  }

  async function getBajos(umbral = 10) {
    const url = `${base}/bajos?umbral=${encodeURIComponent(umbral)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  }

  async function getAltos(umbral = 100) {
    const url = `${base}/altos?umbral=${encodeURIComponent(umbral)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    const json = await _handle(res);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(AlertaVO.fromApi);
  }

  return { getPorCaducar, getBajos, getAltos };
};

export default AlertasServiceProxy;
