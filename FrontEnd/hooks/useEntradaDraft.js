// hooks/useEntradaDraft.js
import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useEntradas from './useEntradas'; // tu hook existente que hace el POST real

let globalLotes = [];
/*
  Estructura en globalLotes:
  {
    __tmpId, idProducto, nombreProducto, cantidad, caducidad (YYYY-MM-DD|null)
  }
*/

export const useEntradaDraft = () => {
  const [lotes, setLotes] = useState(globalLotes);
  const [confirming, setConfirming] = useState(false);
  const lastConfirmRef = useRef(0);

  // Usamos tu hook real para hablar con el backend
  const { createEntrada } = useEntradas();

  const syncLotes = useCallback(() => {
    setLotes([...globalLotes]);
  }, []);

  const agregarLote = useCallback((loteUI) => {
    // loteUI: { idProducto, nombreProducto, cantidad, caducidad|null }
    const item = { __tmpId: Date.now(), ...loteUI };
    globalLotes.push(item);
    setLotes([...globalLotes]);
  }, []);

  const removerLote = useCallback((tmpId) => {
    const nuevas = globalLotes.filter(l => l.__tmpId !== tmpId);
    globalLotes = nuevas;
    setLotes(nuevas);
  }, []);

  const limpiarLotes = useCallback(() => {
    globalLotes = [];
    setLotes([]);
  }, []);

  const confirmarEntrada = useCallback(async ({ proveedor, notas }) => {
    if (!globalLotes.length) {
      Alert.alert('No hay lotes para confirmar');
      return false;
    }
    if (!proveedor?.trim()) {
      Alert.alert('Proveedor requerido', 'Ingresa el nombre del proveedor.');
      return false;
    }

    // anti doble-tap 1.5s
    const now = Date.now();
    if (now - lastConfirmRef.current < 1500) return false;
    lastConfirmRef.current = now;

    setConfirming(true);
    try {
      const fecha = new Date().toISOString().split('T')[0];
      const idUsuarioStr = await AsyncStorage.getItem('idUsuario');
      const idUsuario = idUsuarioStr ? parseInt(idUsuarioStr, 10) : null;

      const entradaPayload = {
        proveedor: proveedor.trim(),
        notas: (notas || '').trim(),
        fecha,
        idUsuario,
        idTipo: 1, // ajústalo si tu backend usa catálogo
      };

      // Quitamos __tmpId antes de enviar
      const lotesPayload = globalLotes.map(({ __tmpId, ...rest }) => rest);

      const result = await createEntrada(entradaPayload, lotesPayload);
      if (result?.success) {
        limpiarLotes();
        return true;
      } else {
        Alert.alert('Error', result?.error || 'No se pudo registrar la entrada');
        return false;
      }
    } catch (e) {
      Alert.alert('Error al confirmar', e?.message || 'Fallo al enviar la entrada.');
      return false;
    } finally {
      setConfirming(false);
    }
  }, [createEntrada, limpiarLotes]);

  return {
    lotes,
    confirming,
    syncLotes,
    agregarLote,
    removerLote,
    limpiarLotes,
    confirmarEntrada,
  };
};
