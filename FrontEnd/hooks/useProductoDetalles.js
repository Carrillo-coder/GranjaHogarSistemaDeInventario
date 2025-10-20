import { useEffect, useState, useCallback } from 'react';
import ProductoDetallesProxy from '../proxies/ProductoDetallesProxy';

export default function useProductoDetalle(idProducto) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(Boolean(idProducto));
  const [error, setError] = useState(null);

  const proxy = ProductoDetallesProxy();

  const fetchProductoDetalle = useCallback(async () => {
    if (!idProducto) return;

    setLoading(true);
    setError(null);

    try {
      // Peticiones en paralelo para velocidad
      const [prodRes, cantidadRes, caducidadRes] = await Promise.allSettled([
        proxy.getById(idProducto),
        proxy.getCantidad(idProducto),
        proxy.getCaducidad(idProducto),
      ]);

      // manejar resultados
      if (prodRes.status === 'rejected') throw prodRes.reason;
      const prodData = prodRes.value;

      // cantidad y caducidad pueden venir como { idProducto, cantidadTotal } y { idProducto, caducidad }
      const cantidadData = cantidadRes.status === 'fulfilled' ? cantidadRes.value : null;
      const caducidadData = caducidadRes.status === 'fulfilled' ? caducidadRes.value : null;

      const detalle = {
        idProducto: prodData?.idProducto ?? idProducto,
        nombre: prodData?.nombre ?? '',
        presentacion: prodData?.presentacion ?? '',
        idCategoria: prodData?.idCategoria ?? null,
        categoria: prodData?.categoria ?? null,
        cantidadTotal: cantidadData?.cantidadTotal ?? (cantidadData?.cantidad ?? null) ?? 0,
        caducidadProxima: caducidadData?.caducidad ?? caducidadData?.fecha ?? null,
        // opcional: puedes añadir más campos calculados aquí
      };

      setProducto(detalle);
    } catch (err) {
      console.error('useProductoDetalle error:', err);
      setError(err.message || 'Error al cargar producto');
      setProducto(null);
    } finally {
      setLoading(false);
    }
  }, [idProducto]); 

  useEffect(() => {
    fetchProductoDetalle();
  }, [fetchProductoDetalle]);

  return { producto, loading, error, reload: fetchProductoDetalle };
}
