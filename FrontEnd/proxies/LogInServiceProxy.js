import { API_BASE_URL } from '@env';

const BASE = API_BASE_URL;

async function _parseBody(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const LogInServiceProxy = () => {
  async function logInUser(UserName, password) {
    const url = `${BASE}/api/inventario/logIn/${UserName}`; 
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const body = await _parseBody(res);

    if (!res.ok) {
      const msg = body?.message || res.statusText || 'Error al iniciar sesión';
      const err = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  }

  return { logInUser };
};

export default LogInServiceProxy;

