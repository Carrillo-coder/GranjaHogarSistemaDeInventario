
import { useState } from 'react';
import LotesServiceProxy from '../proxies/LotesServiceProxy';

const useLotes = () => {
	const { crearLote } = LotesServiceProxy();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createLote = async (lote) => {
		setLoading(true);
		setError(null);
		try {
			const result = await crearLote(lote);
			return result;
		} catch (e) {
			setError(e.message || 'Error al crear lote');
			throw e;
		} finally {
			setLoading(false);
		}
	};

	return { createLote, loading, error };
};

export default useLotes;
