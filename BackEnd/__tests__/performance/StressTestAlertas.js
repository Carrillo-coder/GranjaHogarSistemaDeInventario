import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// ==== Parámetros por entorno (puedes sobrescribir con -e) ====
const BASE_URL = 'http://localhost:5000';
const DIAS = __ENV.DIAS || '10';
const UMBRAL_BAJO = __ENV.UMBRAL_BAJO || '10';
const UMBRAL_ALTO = __ENV.UMBRAL_ALTO || '100';

// ==== Métricas personalizadas ====
const t_porCaducar = new Trend('por_caducar_duration');
const t_bajos      = new Trend('bajos_duration');
const t_altos      = new Trend('altos_duration');
const errRate      = new Rate('http_errors');

// ==== Escenarios ====
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.02'],          // <2% de errores
    http_req_duration: ['p(95)<500'],        // 95% de req < 500ms
    por_caducar_duration: ['p(95)<500'],
    bajos_duration: ['p(95)<500'],
    altos_duration: ['p(95)<500'],
    http_errors: ['rate<0.02'],
  },
  scenarios: {
    // Carga constante ligera sobre cada endpoint
    porCaducar_const: {
      executor: 'constant-vus',
      exec: 'hitPorCaducar',
      vus: Number(__ENV.VUS_POR_CADUCAR || 20),
      duration: __ENV.DUR_POR_CADUCAR || '30s',
    },
    bajos_const: {
      executor: 'constant-vus',
      exec: 'hitBajos',
      vus: Number(__ENV.VUS_BAJOS || 20),
      duration: __ENV.DUR_BAJOS || '30s',
    },
    altos_const: {
      executor: 'constant-vus',
      exec: 'hitAltos',
      vus: Number(__ENV.VUS_ALTOS || 20),
      duration: __ENV.DUR_ALTOS || '30s',
    },

    // Spike en /bajos para simular pico
    bajos_spike: {
      executor: 'ramping-arrival-rate',
      exec: 'hitBajos',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 100,
      stages: [
        { target: 50, duration: '10s' },
        { target: 50, duration: '15s' },
        { target: 5,  duration: '10s' },
      ],
    },

    // Soak test corto en /por-caducar
    porCaducar_soak: {
      executor: 'constant-arrival-rate',
      exec: 'hitPorCaducar',
      rate: 10, // req/seg
      timeUnit: '1s',
      duration: __ENV.DUR_SOAK || '2m',
      preAllocatedVUs: 30,
      maxVUs: 60,
    },
  },
};

const HEADERS = { headers: { Accept: 'application/json' } };

export function hitPorCaducar() {
  const url = `${BASE_URL}/api/inventario/alertas/por-caducar?dias=${encodeURIComponent(DIAS)}`;
  const res = http.get(url, HEADERS);
  t_porCaducar.add(res.timings.duration);
  errRate.add(res.status >= 400);
  check(res, {
    'status 200': (r) => r.status === 200,
    'json tiene data': (r) => (r.json('data') || []) instanceof Array,
  });
  sleep(0.3);
}

export function hitBajos() {
  const url = `${BASE_URL}/api/inventario/alertas/bajos?umbral=${encodeURIComponent(UMBRAL_BAJO)}`;
  const res = http.get(url, HEADERS);
  t_bajos.add(res.timings.duration);
  errRate.add(res.status >= 400);
  check(res, {
    'status 200': (r) => r.status === 200,
    'json tiene data': (r) => (r.json('data') || []) instanceof Array,
  });
  sleep(0.3);
}

export function hitAltos() {
  const url = `${BASE_URL}/api/inventario/alertas/altos?umbral=${encodeURIComponent(UMBRAL_ALTO)}`;
  const res = http.get(url, HEADERS);
  t_altos.add(res.timings.duration);
  errRate.add(res.status >= 400);
  check(res, {
    'status 200': (r) => r.status === 200,
    'json tiene data': (r) => (r.json('data') || []) instanceof Array,
  });
  sleep(0.3);
}
