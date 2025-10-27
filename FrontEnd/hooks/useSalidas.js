import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SalidasProxyService from '../proxies/SalidasServiceProxy';

let globalSalidas = [];

/**
 * Estructura de ítem en globalSalidas:
 * {
 *   id, idProducto, nombre (para UI), cantidad,
 *   idTipo, tipoNombre (para UI),
 *   idDepartamento, deptoNombre (para UI),
 *   notas
 * }
 */
export const useSalidas = () => {
  const [salidas, setSalidas] = useState(globalSalidas);
  const [confirming, setConfirming] = useState(false);
  const lastConfirmRef = useRef(0);
  const proxy = SalidasProxyService();

  const syncSalidas = useCallback(() => {
    setSalidas([...globalSalidas]);
  }, []);

  const agregarSalida = useCallback((salidaUI) => {
    // salidaUI debe traer: idProducto, nombre, cantidad, idTipo, tipoNombre, idDepartamento, deptoNombre, notas
    const item = { id: Date.now(), ...salidaUI };
    globalSalidas.push(item);
    setSalidas([...globalSalidas]);
  }, []);

  const removerSalida = useCallback((salidaId) => {
    const nuevas = globalSalidas.filter(s => s.id !== salidaId);
    globalSalidas = nuevas;
    setSalidas(nuevas);
  }, []);

  const limpiarResumen = useCallback(() => {
    globalSalidas = [];
    setSalidas([]);
  }, []);

  const confirmarSalidas = useCallback(async () => {
    if (!globalSalidas.length) {
      Alert.alert('No hay salidas para confirmar');
      return false;
    }
    // anti doble-tap: 1.5s
    const now = Date.now();
    if (now - lastConfirmRef.current < 1500) return false;
    lastConfirmRef.current = now;

    setConfirming(true);
    try {
      const fecha = new Date().toISOString().split('T')[0];
      const idUsuarioStr = await AsyncStorage.getItem('idUsuario');
      const idUsuario = idUsuarioStr ? parseInt(idUsuarioStr, 10) : null;

      // Mapear a lo que espera el backend
      const payload = globalSalidas.map(s => ({
        idTipo: s.idTipo,
        idDepartamento: s.idDepartamento,
        idProducto: s.idProducto,
        cantidad: s.cantidad,
        idUsuario,
        fecha,
        notas: s.notas || ''
      }));

      await proxy.agregarSalidasLote(payload);
      limpiarResumen();
      return true;
    } catch (e) {
      Alert.alert('Error al confirmar', e?.message || 'No se pudo procesar la salida.');
      return false;
    } finally {
      setConfirming(false);
    }
  }, [limpiarResumen, proxy]);

  return {
    salidas,
    confirming,
    agregarSalida,
    removerSalida,
    syncSalidas,
    confirmarSalidas,
    limpiarResumen
  };
};
