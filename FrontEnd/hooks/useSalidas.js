import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

let globalSalidas = [];

const BASE_URL = "http://192.168.0.16:5000";

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

    const fechaActual = new Date().toISOString().split('T')[0]; 
    const idUsuario = await AsyncStorage.getItem('idUsuario');

    const salidasPayload = globalSalidas.map(s => ({
      ...s,
      idUsuario: idUsuario ? parseInt(idUsuario, 10) : null,
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
