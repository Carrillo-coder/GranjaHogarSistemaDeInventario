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
  const url = 'http://localhost:5000/api/inventario/salidas';
  const payload = JSON.stringify({
    idTipo: getRandom(tipos),
    idUsuario: getRandom(usuarios),
    idDepartamento: getRandom(departamentos),
    cantidad: Math.floor(Math.random() * 5) + 1,
    notas: 'Prueba de rendimiento con k6',
    fecha: '2025-10-10',
    idProducto: getRandom(productos),
  });


  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    'respuesta rápida (<500ms)': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
