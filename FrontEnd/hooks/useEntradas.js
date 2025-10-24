import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import EntradasServiceProxy from '../proxies/EntradasServiceProxy';

export default function useEntradas() {
  const api = useMemo(() => EntradasServiceProxy(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const createEntrada = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await api.createEntrada(payload);
      setResponse(res);
      return { ok: true, data: res };
    } catch (e) {
      setError(e);
      Alert.alert('Error', e.message || 'No se pudo crear la entrada');
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { createEntrada, loading, error, response };
}
