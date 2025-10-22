import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';


let globalSalidas = [];


const DEFAULT_BASE =
  Platform.OS === 'android'
    ? 'http://10.34.18.74:5000' 
    : 'http://127.0.0.1:5000';

const BASE_URL = DEFAULT_BASE;

export const useSalidas = () => {
  const [salidas, setSalidas] = useState(globalSalidas);

  const syncSalidas = useCallback(() => {
    setSalidas([...globalSalidas]);
  }, []);

  const agregarSalida = useCallback((salida) => {
    globalSalidas.push(salida);
    setSalidas([...globalSalidas]);
  }, []);

  const removerSalida = useCallback((salidaId) => {
    Alert.alert('Función llamada');
    const nuevasSalidas = globalSalidas.filter((s) => s.id !== salidaId);
    globalSalidas = nuevasSalidas;
    setSalidas(nuevasSalidas);
  }, []);

  const confirmarSalidas = useCallback(async () => {
    if (globalSalidas.length === 0) {
      Alert.alert('Error', 'No hay salidas para confirmar');
      return false;
    }

    const usuarioActual = 1; 
    const fechaActual = new Date().toISOString().split('T')[0]; 

    const salidasPayload = globalSalidas.map(s => ({
      ...s,
      idUsuario: usuarioActual,
      fecha: fechaActual,
    }));

    try {
      const response = await fetch(`${BASE_URL}/api/inventario/salidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salidasPayload),
      });

      if (response.ok) {
        globalSalidas = [];
        setSalidas([]);
        return true;
      } else {
        const errorBody = await response.json();
        Alert.alert(
          'Error al Procesar Salida',
          errorBody.message || 'El servidor rechazó la solicitud. Revisa el stock de los productos.'
        );
        return false;
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor para confirmar las salidas.');
      return false;
    }
  }, []);

  const limpiarResumen = useCallback(() => {
    globalSalidas = [];
    setSalidas([]);
  }, []);

  return { salidas, agregarSalida, confirmarSalidas, syncSalidas, removerSalida, limpiarResumen };
};
