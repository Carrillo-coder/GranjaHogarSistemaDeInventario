// hooks/useAlertas.js
import { useEffect, useState, useCallback } from 'react';
import AlertasServiceProxy from '../proxies/AlertasServiceProxy';

const useAlertas = (opts = { dias: 10, umbralBajo: 10, umbralAlto: 100 }) => {
  const [expiring, setExpiring] = useState([]);   // [{ nombre, fecha }]
  const [lowStock, setLowStock] = useState([]);   // [{ nombre, cantidad }]
  const [overStock, setOverStock] = useState([]); // [{ nombre, cantidad }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getPorCaducar, getBajos, getAltos } = AlertasServiceProxy();

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [cad, bajos, altos] = await Promise.all([
        getPorCaducar(opts.dias),
        getBajos(opts.umbralBajo),
        getAltos(opts.umbralAlto),
      ]);

      setExpiring(
        cad.map(x => ({ nombre: x.producto, fecha: x.fechaCaducidad ?? '' }))
      );
      setLowStock(
        bajos.map(x => ({ nombre: x.producto, cantidad: x.cantidad ?? 0 }))
      );
      setOverStock(
        altos.map(x => ({ nombre: x.producto, cantidad: x.cantidad ?? 0 }))
      );
    } catch (e) {
      setError(e?.message || 'Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [getPorCaducar, getBajos, getAltos, opts.dias, opts.umbralBajo, opts.umbralAlto]);

  useEffect(() => { load(); }, [load]);

  return { expiring, lowStock, overStock, loading, error, refresh: load };
};

export default useAlertas;
