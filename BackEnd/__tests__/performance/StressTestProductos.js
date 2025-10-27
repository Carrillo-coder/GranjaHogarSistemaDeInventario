// __tests__/performance/StressTestProductos.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = 'http://localhost:5000/api/inventario';

// Escenarios iguales; solo cambiamos el payload para respetar las validaciones del backend
export const options = {
  scenarios: {
    getAllProductos: {
      executor: 'constant-vus',
      exec: 'getAllProductos',
      vus: 6,
      duration: '30s',
      startTime: '0s',
    },
    getProductoById: {
      executor: 'constant-vus',
      exec: 'getProductoById',
      vus: 6,
      duration: '30s',
      startTime: '0s',
    },
    createProducto: {
      executor: 'constant-vus',
      exec: 'createProducto',
      vus: 6,
      duration: '30s',
      startTime: '35s',
    },
    stressTestProductos: {
      executor: 'ramping-vus',
      exec: 'stressTestProductos',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 6 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 },
      ],
      startTime: '1m10s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    // No tocamos este; cuando los POST ya sean 201, la tasa de fallos bajará sola:
    // 'rate<0.02' significa menos de 2% de requests fallidos.
    http_req_failed: ['rate<0.02'],
  },
};

// Helpers válidos con las reglas del backend
const NOMBRES_VALIDOS = [
  'Jabon Liquido',
  'Leche Entera',
  'Arroz Blanco',
  'Manzana Roja',
  'Pasta Larga',
  'Azucar Morena',
  'Sal Fina',
  'Cafe Molido',
  'Te Verde',
];

const CATEGORIAS = ['Perecederos', 'No Perecederos', 'Sanitarios'];

// Presentación permite números y varios símbolos; la usamos para unicidad.
function buildPresentacion(prefix) {
  // __VU y __ITER garantizan que no se repita entre VUs/iteraciones
  return `${prefix} VU${__VU} I${__ITER}`;
}

export function getAllProductos() {
  const res = http.get(`${API_URL}/productos`, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Aceptamos 200 aun si la lista está vacía
  check(res, {
    'GET /productos -> 200': (r) => r.status === 200,
  });

  // Intento adicional (como hacía Diego) por si cambia el endpoint
  if (res.status !== 200) {
    const fallback = http.get(`${API_URL}/productos`, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(fallback, {
      'Fallback GET /productos -> 200': (r) => r.status === 200,
    });
  }

  sleep(0.5);
}

export function getProductoById() {
  // Usa un ID que exista (ajústalo si tu tabla empieza en otro)
  const id = 1;
  const res = http.get(`${API_URL}/productos/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Si no existe, igual no nos tumba el test principal; pero marcamos el check
  check(res, {
    'GET /productos/:id -> 200': (r) => r.status === 200,
  });

  sleep(0.5);
}

export function createProducto() {
  const nombre = NOMBRES_VALIDOS[Math.floor(Math.random() * NOMBRES_VALIDOS.length)];
  const presentacion = buildPresentacion('C'); // C = create scenario
  const categoria = CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)];

  // Usa la clave 'categoría' (con acento) como tú en Postman; tu backend también acepta 'categoria'
  const payload = JSON.stringify({
    nombre,
    presentacion,
    categoría: categoria,
  });

  const res = http.post(`${API_URL}/productos`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'POST /productos -> 201': (r) => r.status === 201,
    'POST /productos success:true': (r) => {
      try {
        const body = JSON.parse(r.body || '{}');
        return body.success === true;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);
}

export function stressTestProductos() {
  const roll = Math.random();

  if (roll < 0.55) {
    // GET
    const res = http.get(`${API_URL}/productos`, { headers: { 'Content-Type': 'application/json' } });
    check(res, { 'Stress GET /productos -> 200': (r) => r.status === 200 });
  } else {
    // POST (misma lógica que createProducto, pero con prefijo distinto para no chocar)
    const nombre = NOMBRES_VALIDOS[Math.floor(Math.random() * NOMBRES_VALIDOS.length)];
    const presentacion = buildPresentacion('S'); // S = stress scenario
    const categoria = CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)];

    const payload = JSON.stringify({
      nombre,
      presentacion,
      categoría: categoria,
    });

    const res = http.post(`${API_URL}/productos`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'Stress POST /productos -> 201': (r) => r.status === 201,
    });
  }

  sleep(Math.random() * 0.3 + 0.1);
}
