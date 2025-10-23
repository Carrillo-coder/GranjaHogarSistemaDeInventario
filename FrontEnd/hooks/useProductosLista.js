import { useEffect, useState, useCallback } from 'react';
import ProductosListaProxy from '../proxies/ProductosListaProxy';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const proxy = ProductosListaProxy();

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proxy.getAllProductos();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, reload: fetchProductos };
}
