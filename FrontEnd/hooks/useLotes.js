import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import LotesServiceProxy from '../proxies/LotesServiceProxy';

let globalLotes = [];

export default function useLotes() {
  const api = useMemo(() => LotesServiceProxy(), []);
  const [lotes, setLotes] = useState(globalLotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const syncLotes = useCallback(() => setLotes([...globalLotes]), []);

  const addLoteLocal = useCallback((lote) => {
    globalLotes.push(lote);
    setLotes([...globalLotes]);
  }, []);

  const createLote = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await api.createLote(payload);
      // push to local summary
      addLoteLocal(payload);
      setResponse(res);
      return { ok: true, data: res };
    } catch (e) {
      setError(e);
      console.error('createLote error', e);
      Alert.alert('Error', e.message || 'No se pudo crear el lote');
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, [api, addLoteLocal]);

  return { lotes, syncLotes, addLoteLocal, createLote, loading, error, response };
}
