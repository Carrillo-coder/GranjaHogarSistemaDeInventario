import { Platform } from 'react-native';
import { File, Directory } from 'expo-file-system';

const API_BASE_URL =
    Platform.OS === 'web'
        ? 'http://localhost:5000'
        : 'http://192.168.1.9:5000';

const ReportesServiceProxy = () => {

    async function generarReporteLotes(formato) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/lotes/reportes?formato=${formato}`);
        const result = await res.json();
        if (!res.ok || !result.success) {
            throw new Error(result.message || `Error ${res.status}`);
        }
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    async function generarReporteEntradas(reporteVO) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/entradas/reportes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reporteVO),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || `Error ${res.status}`);
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    async function generarReporteSalidas(reporteVO, departamento) {
        const res = await fetch(`${API_BASE_URL}/api/inventario/salidas/reportes?departamento=${departamento}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reporteVO),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || `Error ${res.status}`);
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    return { generarReporteEntradas, generarReporteSalidas, generarReporteLotes };
};

export default ReportesServiceProxy;
