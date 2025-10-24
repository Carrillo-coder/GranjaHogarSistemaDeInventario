import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ReportesServiceProxy from '../proxies/ReportesServiceProxy';
import DepartamentosServiceProxy from '../proxies/DepartamentosServiceProxy';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { StorageAccessFramework } from 'expo-file-system/legacy';

const reportTypes = [
  { label: 'Entrada', value: '1' },
  { label: 'Salida', value: '2' },
  { label: 'Inventario', value: '3' },
];

export const useReportesForm = () => {
  const router = useRouter();

  const [reportType, setReportType] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportFormat, setExportFormat] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [generatingReport, setGeneratingReport] = useState(false);
  const { getAll } = DepartamentosServiceProxy();
  const { generarReporteEntradas, generarReporteSalidas, generarReporteLotes } = ReportesServiceProxy();

  const isEntradaReport = reportType === '1';
  const isInventoryReport = reportType === '3';
  const areDatesDisabled = isInventoryReport;
  const isDepartmentDisabled = isInventoryReport || isEntradaReport;

  useEffect(() => {
    getAll()
      .then((data) => {
        const mapped = data.map((d) => ({ label: d.nombre, value: d.idDepartamento.toString() }));
        const allOption = { label: 'Todos', value: '0' };
        setDepartments([allOption, ...mapped]);
      })
      .catch((error) => {
        console.error('Error al obtener departamentos:', error);
      });
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      if (endDate && selectedDate > endDate) {
        Alert.alert('Error', 'La fecha de inicio no puede ser posterior a la fecha final.');
        return;
      }
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      if (startDate && selectedDate < startDate) {
        Alert.alert('Error', 'La fecha final no puede ser menor que la fecha de inicio.');
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const showStartDatepicker = () => { if (!areDatesDisabled) setShowStartDatePicker(true); };
  const showEndDatepicker = () => { if (!areDatesDisabled) setShowEndDatePicker(true); };
  const handleDepartmentChange = (value) => { if (!isDepartmentDisabled) setDepartment(value); };

  const validateForm = () => {
    if (!reportType) { Alert.alert('Error', 'Por favor selecciona un tipo de reporte antes de descargar.'); return; }
    if (!exportFormat) { Alert.alert('Error', 'Por favor selecciona un formato de exportación antes de descargar.'); return; }
    if (!areDatesDisabled && (!startDate || !endDate)) { Alert.alert('Error', 'Por favor selecciona un rango de fechas válido antes de descargar.'); return; }
    if (!isDepartmentDisabled && !department) { Alert.alert('Error', 'Por favor selecciona un departamento antes de descargar.'); return; }
    return true;
  };

  const handleConfirmDownload = async () => {
    if (!validateForm()) return;
    setGeneratingReport(true);
    try {
      let response;
      const formato = exportFormat === 'Excel' ? 'XLSX' : exportFormat;

      if (reportType === '3') { response = await generarReporteLotes(formato);
      } else {
        const fechaInicio = formatDate(startDate);
        const fechaFin = formatDate(endDate);
        if (reportType === '1') { response = await generarReporteEntradas(fechaInicio, fechaFin, formato);
        } else if (reportType === '2') { response = await generarReporteSalidas(fechaInicio, fechaFin, formato, department); }
      }

      if (Platform.OS === 'web') {
        if (response.base64) {
          const blob = await fetch(`data:${response.mimeType};base64,${response.base64}`).then(r => r.blob());
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.filename;
          a.click();
          URL.revokeObjectURL(url);

        } else if (response.blob) {
          const url = URL.createObjectURL(response.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.filename;
          a.click();
          URL.revokeObjectURL(url);
        }
        Alert.alert('Reporte generado con éxito (web)');

      } else {
        if (!response.base64) throw new Error('No se recibió base64 del servidor');

        const fileUri = `${FileSystem.documentDirectory}${response.filename}`;
        await FileSystem.writeAsStringAsync(fileUri, response.base64, { encoding: FileSystem.EncodingType.Base64, });

        if (Platform.OS === 'android') {
          try {
            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
              const base64Data = response.base64;
              const newUri = await StorageAccessFramework.createFileAsync( permissions.directoryUri, response.filename, response.mimeType );
              await FileSystem.writeAsStringAsync(newUri, base64Data, { encoding: FileSystem.EncodingType.Base64, });
              Alert.alert('Éxito', 'Reporte guardado correctamente en la carpeta seleccionada.');
            } else {
              Alert.alert('Aviso', 'No se otorgaron permisos para guardar el archivo.');
            }
          } catch (err) {
            console.error('Error al guardar el archivo:', err);
            Alert.alert('Error', 'No se pudo guardar el reporte.');
          }
        } else {
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) { await Sharing.shareAsync(fileUri, { mimeType: response.mimeType, dialogTitle: 'Abrir o compartir reporte', });
          } else {
            Alert.alert('Reporte guardado', `Ruta interna: ${fileUri}`);
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', `No se pudo generar el reporte: ${error.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  return {
    reportTypes, reportType, setReportType,
    departments, department, handleDepartmentChange,
    startDate, endDate,
    exportFormat, setExportFormat,
    showStartDatePicker, setShowStartDatePicker,
    showEndDatePicker, setShowEndDatePicker,

    areDatesDisabled, isDepartmentDisabled,
    formatDate, onStartDateChange, onEndDateChange,
    showStartDatepicker, showEndDatepicker,
    handleConfirmDownload,
    generatingReport,
  };
};