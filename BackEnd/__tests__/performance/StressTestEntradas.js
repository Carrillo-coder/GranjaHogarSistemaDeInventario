import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// ====                         Parámetros y Configuración                        ====

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

// ====                             Métricas Personalizadas                         ====

const t_crearEntrada_duration = new Trend('crear_entrada_duration');
const errRate = new Rate('http_errors');

// ====                                  Escenarios                                 ====

export const options = {
  thresholds: {
    'http_req_failed': ['rate<0.02'],
    'http_req_duration': ['p(95)<800'],
    'crear_entrada_duration': ['p(95)<800'],
  },
  scenarios: {
    creacion_entradas_ramping: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '15s', target: 5 },
        { duration: '5s', target: 0 },
      ],
      exec: 'createEntradaTest',
    },
  },
};


// ====                             Lógica de la Prueba                             ====

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' };

export function createEntradaTest() {
  const entradaBody = {
    proveedor: `Proveedor VU ${__VU} Iter ${__ITER}`,
    notas: 'Prueba de carga k6 - Solo Entradas',
    fecha: new Date().toISOString().split('T')[0],
    idUsuario: 1,
    idTipo: 1,
  };
  const payload = JSON.stringify(entradaBody);

  const res = http.post(`${BASE_URL}/api/inventario/entradas`, payload, { headers: HEADERS });

  t_crearEntrada_duration.add(res.timings.duration);
  errRate.add(res.status >= 400);

  check(res, {
    'Entrada creada con éxito (status 201)': (r) => r.status === 201,
  });

  sleep(1); 
}
