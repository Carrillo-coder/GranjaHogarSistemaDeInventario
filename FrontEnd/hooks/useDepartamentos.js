import { useEffect, useState, useCallback } from 'react';
import DepartamentosServiceProxy from '../proxies/DepartamentosServiceProxy';

export default function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const proxy = DepartamentosServiceProxy();

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await proxy.getAll();
      setDepartamentos(data);
    } catch (e) {
      setError(e?.message || 'Error al cargar departamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { departamentos, loading, error, reload: fetchAll };
}
