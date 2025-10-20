import { Platform } from 'react-native';

const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:5000'
    : 'http://192.168.1.9:5000'; // reemplaza por la IP local de tu PC, ej: 192.168.1.85

const DepartamentosServiceProxy = () => {
  async function getAll() {
    const response = await fetch(`${API_BASE_URL}/api/inventario/departamentos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Datos de entrada inválidos');
      } else if (response.status === 500) {
        throw new Error('Error al procesar la solicitud');
      } else if (response.status === 503) {
        throw new Error('Servicio no disponible');
      } else {
        throw new Error('Error desconocido');
      }
    }

    const result = await response.json();
    return result.data;
  }

  return { getAll };
};

export default DepartamentosServiceProxy;
