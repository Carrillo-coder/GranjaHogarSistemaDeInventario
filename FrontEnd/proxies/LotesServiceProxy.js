import { API_BASE_URL as ENV_BASE } from '@env';
import Constants from 'expo-constants';

const EXTRA_BASE = Constants?.expoConfig?.extra?.API_BASE_URL;
const DEFAULT_BASE = 'http://10.34.18.74:5000';
const API_BASE_URL = ENV_BASE || EXTRA_BASE || DEFAULT_BASE;

const LotesServiceProxy = () => {
	async function crearLote(payload) {
		const url = `${API_BASE_URL}/api/inventario/lotes`;
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const result = await response.json().catch(() => ({}));
		if (!response.ok) {
			const msg = result?.message || response.statusText || 'Error del servidor';
			const err = new Error(msg);
			err.status = response.status;
			err.body = result;
			throw err;
		}
		return result;
	}
	return { crearLote };
};

export default LotesServiceProxy;
