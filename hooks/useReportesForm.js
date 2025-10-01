import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

const reportTypes = [
  { label: 'Entrada', value: '1' },
  { label: 'Salida', value: '2' },
  { label: 'Inventario', value: '3' },
];

const departments = [
  { label: 'Cocina', value: '1' },
  { label: 'Comedor', value: '2' },
  { label: 'Almacén', value: '3' },
  { label: 'Administración', value: '4' },
];

export const useReportesForm = () => {
  const router = useRouter();
  
  const [reportType, setReportType] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [exportFormat, setExportFormat] = useState('');
  
  const [reportTypeFocus, setReportTypeFocus] = useState(false);
  const [departmentFocus, setDepartmentFocus] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const isInventoryReport = reportType === '3';
  const areDatesDisabled = isInventoryReport;
  const isDepartmentDisabled = isInventoryReport;

  const showStartDatepicker = () => {
    if (!areDatesDisabled) {
      setShowStartDatePicker(true);
    }
  };

  const showEndDatepicker = () => {
    if (!areDatesDisabled) {
      setShowEndDatePicker(true);
    }
  };

  const handleDepartmentChange = (value) => {
    if (!isDepartmentDisabled) {
      setDepartment(value);
    }
  };

const handleGenerateReport = () => {
    console.log('Generando reporte...');
    Alert.alert('Reporte generado con éxito');
}

const handleDownload = () => {
    console.log('Descargando reporte...');
    Alert.alert('Reporte generado con éxito');
}


  return { 
    reportTypes, departments,
    
    reportType, setReportType,
    department,
    startDate, setStartDate,
    endDate, setEndDate,
    exportFormat, setExportFormat,

    reportTypeFocus, setReportTypeFocus,
    departmentFocus, setDepartmentFocus,
    showStartDatePicker, setShowStartDatePicker,
    showEndDatePicker, setShowEndDatePicker,

    areDatesDisabled, isDepartmentDisabled, isInventoryReport,

    formatDate, onStartDateChange, onEndDateChange, 
    showStartDatepicker, showEndDatepicker,
    handleDepartmentChange, handleGenerateReport, handleDownload
  };
};