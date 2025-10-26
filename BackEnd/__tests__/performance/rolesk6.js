import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = "http://localhost:5000/api/inventario";

export const options = {
  scenarios: {
    getRoles: {  
      executor: 'constant-vus',
      exec: 'getRoles',
      vus: 6,
      duration: '30s',
      startTime: '0s',
    },
    
    stressTestRoles: { 
      executor: 'ramping-vus',
      exec: 'stressTestRoles',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 6 },   
        { duration: '30s', target: 10 },   
        { duration: '30s', target: 0 },  
      ],
      startTime: '35s',
    }
  }
}

export function getRoles() {
  const response = http.get(`${API_URL}/roles`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    "GET /roles status code is 200": (r) => r.status === 200,
  });
  
  sleep(0.5);
}

export function stressTestRoles() {
  const response = http.get(`${API_URL}/roles`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    "Stress - GET /roles status is 200": (r) => r.status === 200,
  });

  sleep(Math.random() * 0.3 + 0.1);
}