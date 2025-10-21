import { Platform } from 'react-native';
import { API_BASE_URL as ENV_BASE } from '@env';
import Constants from 'expo-constants';

const EXTRA_BASE = Constants?.expoConfig?.extra?.API_BASE_URL;
const DEFAULT_BASE = 'http://10.34.18.74:5000';
const API_BASE_URL = ENV_BASE || EXTRA_BASE || DEFAULT_BASE;


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