import { useEffect, useState, useCallback } from 'react';
import TiposSalidasServiceProxy from '../proxies/TiposSalidasServiceProxy';

export default function useTiposSalidas() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const proxy = TiposSalidasServiceProxy();

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await proxy.getAll();
      setTipos(data);
    } catch (e) {
      setError(e?.message || 'Error al cargar tipos de salida');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { tipos, loading, error, reload: fetchAll };
}
