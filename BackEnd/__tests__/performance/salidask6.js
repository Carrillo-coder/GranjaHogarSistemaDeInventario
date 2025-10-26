import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], 
  },
};

const tipos = [1, 2];
const departamentos = [1, 2, 3];
const usuarios = [1, 2, 3];
const productos = [1, 2, 3, 4, 5];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function () {
  const baseUrl = 'http://localhost:5000/api/inventario/salidas';

  const randomAction = Math.random();

  if (randomAction < 0.4) {
    const payload = JSON.stringify({
      idTipo: getRandom(tipos),
      idUsuario: getRandom(usuarios),
      idDepartamento: getRandom(departamentos),
      cantidad: Math.floor(Math.random() * 5) + 1,
      notas: 'Prueba de rendimiento con k6',
      fecha: '2025-10-10',
      idProducto: getRandom(productos),
    });

    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(baseUrl, payload, params);

    check(res, {
      'POST status 200 o 201': (r) => r.status === 200 || r.status === 201,
      'POST rápido (<500ms)': (r) => r.timings.duration < 500,
    });
  } else if (randomAction < 0.8) {
    const res = http.get(baseUrl);

    check(res, {
      'GET ALL status 200': (r) => r.status === 200,
      'GET ALL rápido (<500ms)': (r) => r.timings.duration < 500,
    });
  } else {
    
    const randomId = Math.floor(Math.random() * 10) + 1; 
    const res = http.get(`${baseUrl}/${randomId}`);

    check(res, {
      'GET BY ID status 200 o 404': (r) => r.status === 200 || r.status === 404,
      'GET BY ID rápido (<500ms)': (r) => r.timings.duration < 500,
    });
  }

  sleep(1);
}
