import { Platform } from 'react-native';
//import { API_BASE_URL} from '@env';
const API_BASE_URL = "http://10.34.18.73:5000";

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
        console.log(departamento);
        const res = await fetch(`${API_BASE_URL}/api/inventario/salidas/reportes?departamento=${departamento}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fechaInicio, fechaFin, formato }),
        });
        const result = await res.json();
        console.log('Respuesta de generarReporteSalidas:', result);
        if (!res.ok || !result.success) throw new Error(result.message || `Error ${res.status}`);
        return { base64: result.base64, filename: result.filename, mimeType: result.mimeType };
    }

    return { generarReporteEntradas, generarReporteSalidas, generarReporteLotes };
};

export default ReportesServiceProxy;