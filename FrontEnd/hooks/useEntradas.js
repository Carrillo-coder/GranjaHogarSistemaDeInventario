// src/hooks/useEntradas.js
import { useState, useCallback } from 'react';
import EntradasServiceProxy from '../proxies/EntradasServiceProxy';
//import { API_BASE_URL as BASE } from '@env';
const BASE = "http://10.34.18.73:5000";

export const useEntradas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createEntrada = useCallback(async (entradaPayload, lotes = []) => {
    setLoading(true);
    setError('');
    try {
      // 1) Crear la entrada principal
      const proxy = EntradasServiceProxy();
      const entradaRes = await proxy.createEntrada(entradaPayload);
      const idEntrada = entradaRes?.data?.idEntrada || entradaRes?.idEntrada;

      if (!idEntrada) throw new Error('No se recibió el ID de la entrada');

      // 2) Crear lotes asociados (cantidad y unidadesExistentes iguales al inicio)
      for (const lote of lotes) {
        const body = {
          cantidad: Number(lote.cantidad),
          unidadesExistentes: Number(lote.cantidad),
          caducidad: lote.caducidad || null,   // MySQL DATE acepta null
          activo: 1,                            // opcional: BIT (1 = true)
          idProducto: Number(lote.idProducto),
          idEntrada,
        };

        console.log('[POST Lote] =>', body);

        const resp = await fetch(`${BASE}/api/inventario/lotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          console.error('Error creando lote:', txt);
          throw new Error('Error al crear uno de los lotes');
        }
      }

      setLoading(false);
      return { success: true, idEntrada };
    } catch (err) {
      console.error('[useEntradas] Error:', err);
      setError(err.message || 'Error al crear entrada');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  return { createEntrada, loading, error };
};

export default useEntradas;
