import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000";

export const options = {
  scenarios: {
    loginStressTest: {
      executor: 'constant-vus',
      exec: 'logIn',
      vus: 100, // Número de usuarios virtuales
      duration: '1m', // Duración de la prueba
    },
  },
};

export function logIn() {
  const credentials = {
    password: '123456',
  };

  const response = http.post(`${API_URL}/api/inventario/login/admin`, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    "POST login status code is 200": (r) => r.status === 200,
    "Response contains token": (r) => r.json().hasOwnProperty('token'),
  });

  sleep(1); // Espera entre solicitudes
}  