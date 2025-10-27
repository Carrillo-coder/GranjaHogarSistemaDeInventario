// hooks/useAlertas.js
import { useEffect, useState, useCallback, useRef } from 'react';
import AlertasServiceProxy from '../proxies/AlertasServiceProxy';

const INTERVAL_MS = 5000; // auto-refresh cada 5s
const DEFAULTS = { dias: 10, umbralBajo: 10, umbralAlto: 100 };

const useAlertas = (opts = DEFAULTS) => {
  const dias = opts?.dias ?? DEFAULTS.dias;
  const umbralBajo = opts?.umbralBajo ?? DEFAULTS.umbralBajo;
  const umbralAlto = opts?.umbralAlto ?? DEFAULTS.umbralAlto;

  const [expiring, setExpiring] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [overStock, setOverStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getPorCaducar, getBajos, getAltos } = AlertasServiceProxy;

  // control de concurrencia + cancelación + intervalo
  const abortRef = useRef(null);
  const inFlightRef = useRef(false);
  const intervalRef = useRef(null);

  const fetchAll = useCallback(async () => {
    if (inFlightRef.current) return; // evita solapamientos
    inFlightRef.current = true;

    if (abortRef.current) {
      try { abortRef.current.abort(); } catch {}
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');

    try {
      const [cad, bajos, altos] = await Promise.all([
        getPorCaducar(dias, abortRef.current.signal),
        getBajos(umbralBajo, abortRef.current.signal),
        getAltos(umbralAlto, abortRef.current.signal),
      ]);

      setExpiring(cad.map(x => ({ nombre: x.producto, fecha: x.fechaCaducidad ?? '' })));
      setLowStock(bajos.map(x => ({ nombre: x.producto, cantidad: x.cantidad ?? 0 })));
      setOverStock(altos.map(x => ({ nombre: x.producto, cantidad: x.cantidad ?? 0 })));
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError(e?.message || 'Error al cargar alertas');
      }
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [dias, umbralBajo, umbralAlto, getPorCaducar, getBajos, getAltos]);

  // primera carga + auto-refresh cada 5s
  useEffect(() => {
    fetchAll(); // primer fetch inmediato
    intervalRef.current = setInterval(fetchAll, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) {
        try { abortRef.current.abort(); } catch {}
      }
    };
  }, [fetchAll]);

  return { expiring, lowStock, overStock, loading, error, refresh: fetchAll };
};

export default useAlertas;
