import http from 'k6/http';
import { check, sleep } from 'k6';

const API_BASE = "http://localhost:5000/api/inventario";
const API_PRODUCTOS = `${API_BASE}/productos`;

export const options = {
  scenarios: {
    getAllProductos: {
      executor: 'constant-vus',
      exec: 'getAllProductos',
      vus: 10,  
      duration: '30s',
      startTime: '0s',
    },

    getProductoById: {
      executor: 'constant-vus',
      exec: 'getProductoById',
      vus: 8,
      duration: '30s',
      startTime: '0s',
    },

    getCantidadStock: {
      executor: 'constant-vus',
      exec: 'getCantidadStock',
      vus: 6,
      duration: '25s',
      startTime: '35s',
    },

    getCaducidadProxima: {
      executor: 'constant-vus',
      exec: 'getCaducidadProxima',
      vus: 6,
      duration: '25s',
      startTime: '35s',
    },


    createProducto: {
      executor: 'constant-vus',
      exec: 'createProducto',
      vus: 5,
      duration: '30s',
      startTime: '65s',
    },

    updateProducto: {
      executor: 'constant-vus',
      exec: 'updateProducto',
      vus: 5,
      duration: '30s',
      startTime: '100s',
    },

    deleteProducto: {
      executor: 'constant-vus',
      exec: 'deleteProducto',
      vus: 4,
      duration: '25s',
      startTime: '135s',
    },

    stressTestCompleto: {
      executor: 'ramping-vus',
      exec: 'stressTestCompleto',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 15 },  // Subida gradual
        { duration: '1m', target: 25 },   // Carga máxima
        { duration: '30s', target: 10 },  // Bajada controlada
        { duration: '20s', target: 0 },   // Enfriamiento
      ],
      startTime: '165s',
    }
  },
  
  // Umbrales de performance
  thresholds: {
    http_req_failed: ['rate<0.01'],    // Menos del 1% de errores
    http_req_duration: ['p(95)<2000'], // 95% de requests en menos de 2s
    checks: ['rate>0.95']              // 95% de checks deben pasar
  }
};
 
// IDs de prueba (ajusta según tu base de datos)
const PRODUCTO_IDS = [1, 2, 3, 4, 5]; // Productos existentes para pruebas
let createdProductIds = []; // Para almacenar IDs creados durante las pruebas

// ========== FUNCIONES DE PRUEBA ==========

export function getAllProductos() {
  // Aleatoriamente con o sin filtros
  const useFilters = Math.random() > 0.7;
  let url = API_PRODUCTOS;
  
  if (useFilters) {
    const filters = ['Paracetamol', 'Amoxicilina', 'Ibuprofeno', 'Jarabe', 'Tabletas', 'Cápsulas'];
    const nombreFilter = filters[Math.floor(Math.random() * filters.length)];
    const presentacionFilter = filters[Math.floor(Math.random() * filters.length)];
    
    url += `?nombre=${nombreFilter}&presentacion=${presentacionFilter}`;
  }

  const response = http.get(url, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'getAllProductos' }
  });

  check(response, {
    'GET /productos status 200': (r) => r.status === 200,
    'GET /productos success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    },
    'GET /productos tiene data array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.data);
      } catch {
        return false;
      }
    }
  });

  sleep(1);
}

export function getProductoById() {
  const productoId = PRODUCTO_IDS[Math.floor(Math.random() * PRODUCTO_IDS.length)];
  const response = http.get(`${API_PRODUCTOS}/${productoId}`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'getProductoById' }
  });

  check(response, {
    'GET /productos/:id status 200': (r) => r.status === 200,
    'GET /productos/:id success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    },
    'GET /productos/:id retorna producto correcto': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.idProducto === productoId;
      } catch {
        return false;
      }
    }
  });

  sleep(0.8);
}

export function getCantidadStock() {
  const productoId = PRODUCTO_IDS[Math.floor(Math.random() * PRODUCTO_IDS.length)];
  const response = http.get(`${API_PRODUCTOS}/${productoId}/cantidad`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'getCantidadStock' }
  });

  check(response, {
    'GET /productos/:id/cantidad status 200': (r) => r.status === 200,
    'GET /cantidad retorna cálculo correcto': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.data && typeof body.data.cantidadTotal === 'number';
      } catch {
        return false;
      }
    }
  });

  sleep(1.2);
}

export function getCaducidadProxima() {
  const productoId = PRODUCTO_IDS[Math.floor(Math.random() * PRODUCTO_IDS.length)];
  const response = http.get(`${API_PRODUCTOS}/${productoId}/caducidad`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'getCaducidadProxima' }
  });

  check(response, {
    'GET /productos/:id/caducidad status 200': (r) => r.status === 200,
    'GET /caducidad retorna data válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.data;
      } catch {
        return false;
      }
    }
  });

  sleep(1.2);
}

export function createProducto() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  const categorias = ['Analgésicos', 'Antibióticos', 'Vitaminas', 'Antiinflamatorios', 'Jarabes'];
  const presentaciones = ['Tabletas 500mg', 'Cápsulas 250mg', 'Jarabe 120ml', 'Crema 30g', 'Gotas 15ml'];
  
  const data = {
    nombre: `Producto_K6_${timestamp}_${random}`,
    presentacion: presentaciones[Math.floor(Math.random() * presentaciones.length)],
    categoria: categorias[Math.floor(Math.random() * categorias.length)]
  };

  const response = http.post(
    API_PRODUCTOS,
    JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'createProducto' }
    }
  );

  const checks = {
    'POST /productos status 201': (r) => r.status === 201,
    'POST /productos success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    }
  };

  if (check(response, checks)) {
    try {
      const body = JSON.parse(response.body);
      if (body.data && body.data.idProducto) {
        createdProductIds.push(body.data.idProducto);
      }
    } catch (e) {
      // No critical if we can't store the ID
    }
  }

  sleep(2); // Más tiempo entre creaciones
}

export function updateProducto() {
  // Usar productos existentes o creados en pruebas
  const availableIds = [...PRODUCTO_IDS, ...createdProductIds].filter(id => id);
  if (availableIds.length === 0) {
    sleep(1);
    return;
  }

  const productoId = availableIds[Math.floor(Math.random() * availableIds.length)];
  const timestamp = Date.now();
  
  const data = {
    nombre: `Producto_Actualizado_${timestamp}`,
    presentacion: 'Tabletas 750mg',
    categoria: 'Analgésicos Potentes'
  };

  const response = http.put(
    `${API_PRODUCTOS}/${productoId}`,
    JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'updateProducto' }
    }
  );

  check(response, {
    'PUT /productos/:id status 200': (r) => r.status === 200,
    'PUT /productos/:id success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    }
  });

  sleep(1.5);
}

export function deleteProducto() {
  // Solo eliminar productos que creamos en estas pruebas
  if (createdProductIds.length === 0) {
    sleep(1);
    return;
  }

  const productoId = createdProductIds.pop(); // Tomar el último creado

  const response = http.del(
    `${API_PRODUCTOS}/${productoId}`,
    null,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'deleteProducto' }
    }
  );

  check(response, {
    'DELETE /productos/:id status 200': (r) => r.status === 200,
    'DELETE /productos/:id success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    }
  });

  sleep(2); // Más tiempo entre eliminaciones
}

export function stressTestCompleto() {
  const action = Math.random();
  
  if (action < 0.4) {
    // 40%: Consultas generales
    getAllProductos();
    
  } else if (action < 0.6) {
    // 20%: Consulta específica
    getProductoById();
    
  } else if (action < 0.75) {
    // 15%: Cálculo de stock
    getCantidadStock();
    
  } else if (action < 0.85) {
    // 10%: Consulta caducidad
    getCaducidadProxima();
    
  } else if (action < 0.92) {
    // 7%: Crear producto
    createProducto();
    
  } else if (action < 0.97) {
    // 5%: Actualizar producto
    updateProducto();
    
  } else {
    // 3%: Eliminar producto
    deleteProducto();
  }
}

// Función de limpieza (opcional)
export function teardown() {
  console.log(`Productos creados durante pruebas: ${createdProductIds.length}`);
  // Aquí podrías agregar lógica para limpiar datos de prueba
}
