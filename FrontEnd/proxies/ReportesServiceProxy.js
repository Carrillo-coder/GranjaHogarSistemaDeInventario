import { Platform } from 'react-native';
import { API_BASE_URL as ENV_BASE } from '@env';
import Constants from 'expo-constants';

const EXTRA_BASE = Constants?.expoConfig?.extra?.API_BASE_URL;
const DEFAULT_BASE = 'http://10.34.18.74:5000'; // Android emulador; usa tu IP en dispositivo real
const API_BASE_URL = ENV_BASE || EXTRA_BASE || DEFAULT_BASE;

const ReportesServiceProxy = () => {

    async function generarReporteLotes(formato) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/lotes/reportes?formato=${formato}`);
        const result = await res.json();
        if (!res.ok || !result.success) {
            throw new Error(result.message || `Error ${res.status}`);
        }
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    async function generarReporteEntradas(fechaInicio, fechaFin, formato) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/entradas/reportes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fechaInicio, fechaFin, formato }),
        });
        const result = await res.json();
        
        if (!res.ok || !result.success) throw new Error(result.message || `Error ${res.status}`);
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    async function generarReporteSalidas(fechaInicio, fechaFin, formato, departamento) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/salidas/reportes?departamento=${departamento}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fechaInicio, fechaFin, formato }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || `Error ${res.status}`);
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    return { generarReporteEntradas, generarReporteSalidas, generarReporteLotes };
};

export default ReportesServiceProxy;