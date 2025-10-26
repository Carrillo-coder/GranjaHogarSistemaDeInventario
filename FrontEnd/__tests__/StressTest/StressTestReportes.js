import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000";

export const options = {
  scenarios: {
    reporteLotesStressTest: {
      executor: 'constant-vus',
      exec: 'reporteLotes',
      vus: 25,
      duration: '1m',
    },
    reporteSalidasStressTest: {
      executor: 'constant-vus',
      exec: 'reporteSalidas',
      vus: 25,
      duration: '1m',
    },
    reporteEntradasStressTest: {
      executor: 'constant-vus',
      exec: 'reporteEntradas',
      vus: 25,
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

export function reporteSalidas() {
  const payload = {
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-31',
    formato: 'PDF',
  };

  const departamento = '0';

  const response = http.post(`${API_URL}/api/inventario/salidas/reportes?departamento=${departamento}`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    "POST reporte salidas status code is 200": (r) => r.status === 200,
    "Response contains base64": (r) => r.json().hasOwnProperty('base64'),
  });

  sleep(1);
}

export function reporteEntradas() {
  const payload = {
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-31',
    formato: 'PDF',
  };

  const response = http.post(`${API_URL}/api/inventario/entradas/reportes`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    "POST reporte entradas status code is 200": (r) => r.status === 200,
    "Response contains base64": (r) => r.json().hasOwnProperty('base64'),
  });

  sleep(1);
}
