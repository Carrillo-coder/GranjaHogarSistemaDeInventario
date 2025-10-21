import { useCallback, useMemo, useState } from 'react';
import ProductosServiceProxy from '../proxies/ProductosServiceProxy';

export default function useCrearProductos() {
  const api = useMemo(() => ProductosServiceProxy(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const crearProducto = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const resp = await api.crearProducto(payload);
      setResponse(resp);
      return { ok: true, data: resp };
    } catch (e) {
      setError(e);
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { crearProducto, loading, error, response };
}