import { useState } from 'react';
import EntradasServiceProxy from '../proxies/EntradasServiceProxy';

const useEntradas = () => {
	const { crearEntrada } = EntradasServiceProxy();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createEntrada = async (entrada) => {
		setLoading(true);
		setError(null);
		try {
			const result = await crearEntrada(entrada);
			return result;
		} catch (e) {
			setError(e.message || 'Error al crear entrada');
			throw e;
		} finally {
			setLoading(false);
		}
	};

	return { createEntrada, loading, error };
};

export default useEntradas;
