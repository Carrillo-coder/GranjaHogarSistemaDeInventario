import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000";

export const options = {
  scenarios: {
    departamentosStressTest: {
      executor: 'constant-vus',
      exec: 'getDepartamentos',
      vus: 25,
      duration: '1m',
    },
  },
};

export function getDepartamentos() {
  const response = http.get(`${API_URL}/api/inventario/departamentos`);

  check(response, {
    "GET departamentos status code is 200": (r) => r.status === 200,
    "Response is an array": (r) => {
        try {
            const body = r.json();
            return Array.isArray(body.data);
        } catch (e) {
            return false;
        }
    },
  });

  sleep(1);
}
