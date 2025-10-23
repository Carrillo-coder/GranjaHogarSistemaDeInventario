import { Platform } from 'react-native';

/**
 * Dirección base del backend.
 * - Si existe EXPO_PUBLIC_API_BASE_URL (definida en .env), se usa esa.
 * - Si no, se usa una IP local por defecto dependiendo de la plataforma.
 */

const DEFAULT_BASE =
  Platform.OS === 'android'
    ? 'http://10.34.18.74:5000'
    : 'http://localhost:5000';

// Toma la variable de entorno de Expo (solo funciona con prefijo EXPO_PUBLIC_)
const envBase = process.env.EXPO_PUBLIC_API_BASE_URL;

// Usa la base que exista y limpia cualquier "/" extra al final
const BASE = (envBase ? envBase.trim() : DEFAULT_BASE).replace(/\/+$/, '');

console.log('🌍 BASE URL usada en LogInServiceProxy:', BASE);

/**
 * Función auxiliar para parsear el cuerpo de las respuestas.
 */
async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/**
 * Proxy de autenticación / login.
 */
const LogInServiceProxy = () => {
  /**
   * Envía credenciales para iniciar sesión.
   * @param {Object} credentials { email, password }
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async function login(credentials) {
    const url = `${BASE}/api/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const body = await _parseBody(response);

    if (!response.ok) {
      const msg = body?.message || response.statusText || 'Error de inicio de sesión';
      const err = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    return body;
  }

  return { login };
};

export default LogInServiceProxy;
