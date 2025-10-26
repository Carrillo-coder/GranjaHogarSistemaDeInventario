import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000/api/inventario";

export const options = {
  scenarios: {
    getAllUsuarios: {  
      executor: 'constant-vus',
      exec: 'getAllUsuarios',
      vus: 6,
      duration: '30s',
      startTime: '0s',
    },
    
    getUsuarioById: { 
      executor: 'constant-vus',
      exec: 'getUsuarioById',
      vus: 6,
      duration: '30s',
      startTime: '0s',
    },

    createUsuario: {  
      executor: 'constant-vus',
      exec: 'createUsuario',
      vus: 6,
      duration: '30s',
      startTime: '35s',
    },
    
    updateUsuario: {   
      executor: 'constant-vus',
      exec: 'updateUsuario',
      vus: 6,
      duration: '30s',
      startTime: '70s',
    },
    
    deleteUsuario: {  
      executor: 'constant-vus',
      exec: 'deleteUsuario',
      vus: 6,
      duration: '30s',
      startTime: '105s',
    },

    stressTest: {  
      executor: 'ramping-vus',
      exec: 'stressTest',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 6 },  
        { duration: '1m', target: 10 },  
        { duration: '30s', target: 0 },  
      ],
      startTime: '140s',
    }
  }
}

export function getAllUsuarios() {
  const response = http.get(`${API_URL}/usuarios`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    "GET /usuarios status code is 200": (r) => r.status === 200
  });

  sleep(0.5);
}

export function getUsuarioById() {
  const usuarioId = 1;
  const response = http.get(`${API_URL}/usuarios/${usuarioId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    "GET /usuarios/:id status code is 200": (r) => r.status === 200
  });
  
  sleep(0.5);
}

export function createUsuario() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  const data = {
    nombreUsuario: `user_k6_${timestamp}_${random}`,
    nombreCompleto: `Usuario K6 Test ${random}`,
    password: 'Test123456',
    idRol: 1  
  };
  
  const response = http.post(
    `${API_URL}/usuarios`, 
    JSON.stringify(data), 
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  check(response, {
    "POST /usuarios status code is 201": (r) => r.status === 201,
    "POST /usuarios success is true": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch (e) {
        return false;
      }
    },
    "POST /usuarios returns created user": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.nombreUsuario === data.nombreUsuario;
      } catch (e) {
        return false;
      }
    },
  });
  
  sleep(0.5);
}

export function updateUsuario() {
  const usuarioId = 1;
  const timestamp = Date.now();
  
  const data = {
    nombreCompleto: `Usuario Actualizado ${timestamp}`
  };
  
  const response = http.put(
    `${API_URL}/usuarios/${usuarioId}`, 
    JSON.stringify(data), 
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  check(response, {
    "PUT /usuarios/:id status code is 200": (r) => r.status === 200,
    "PUT /usuarios/:id returns updated user": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.idUsuario === usuarioId;
      } catch (e) {
        return false;
      }
    },
  });
  
  sleep(0.5);
}

export function deleteUsuario() {
  const usuarioId = 2;
  
  const response = http.del(
    `${API_URL}/usuarios/${usuarioId}`,
    null,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  check(response, {
    "DELETE /usuarios/:id status code is 200": (r) => r.status === 200
  });
  
  sleep(0.5);
}

export function stressTest() {
  const accion = Math.random();
  
  if (accion < 0.5) {
    const response = http.get(`${API_URL}/usuarios`, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
      "Stress - GET /usuarios status is 200": (r) => r.status === 200
    });
    
  } else if (accion < 0.7) {
    const usuarioId = 1;
    const response = http.get(`${API_URL}/usuarios/${usuarioId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
      "Stress - GET /usuarios/:id status is 200": (r) => r.status === 200
    });
    
  } else {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    
    const data = {
      nombreUsuario: `stress_user_${timestamp}_${random}`,
      nombreCompleto: `Usuario Stress ${random}`,
      password: 'Test123456',
      idRol: 1
    };
    
    const response = http.post(
      `${API_URL}/usuarios`, 
      JSON.stringify(data), 
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    check(response, {
      "Stress - POST /usuarios status is 201": (r) => r.status === 201
    });
  }
  
  sleep(0.5);
}