import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000";

export const options = {
  scenarios: {
    reporteLotesStressTest: {
      executor: 'constant-vus',
      exec: 'reporteLotes',
      vus: 50, 
      duration: '1m', 
    },
  },
};

export function reporteLotes() {
  const formato = 'PDF';
  const response = http.get(`${API_URL}/api/inventario/lotes/reportes?formato=${formato}`);

  check(response, {
    "GET reporte lotes status code is 200": (r) => r.status === 200,
    "Response contains base64": (r) => r.json().hasOwnProperty('base64'),
  });

  sleep(1); 
}