import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useReportesForm } from '../../hooks/useReportesForm';
import { CustomDropdown } from '../../components/CustomDropdown';
import { DatePickerField } from '../../components/DatePickerField';
import CustomButton from '../../components/CustomButton';
import Footer from '../../components/Footer';
import { useRouter } from 'expo-router';



const ReportesForm = () => {
    const router = useRouter();
    const {
        reportTypes, departments,
        reportType, setReportType,
        department, startDate, endDate,
        exportFormat, setExportFormat,

        reportTypeFocus, setReportTypeFocus,
        departmentFocus, setDepartmentFocus,
        showStartDatePicker, showEndDatePicker,

        areDatesDisabled, isDepartmentDisabled,

        formatDate, onStartDateChange, onEndDateChange,
        showStartDatepicker, showEndDatepicker,
        handleDepartmentChange,

    } = useReportesForm();

    const handleGenerateReport = () => {
        console.log('Generando reporte...');
        Alert.alert('Reporte generado con éxito');
    }

    const handleDownload = () => {
        console.log('Descargando reporte...');
        Alert.alert('Reporte generado con éxito');
    }
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <CustomDropdown
                        label="Tipo"
                        data={reportTypes}
                        value={reportType}
                        onValueChange={setReportType}
                        placeholder="Entrada/Salida/Inventario"
                        isFocused={reportTypeFocus}
                        onFocus={() => setReportTypeFocus(true)}
                        onBlur={() => setReportTypeFocus(false)}
                    />

                    <View style={styles.dateContainer}>
                        <DatePickerField
                            label="Fecha inicio"
                            value={startDate}
                            onPress={showStartDatepicker}
                            formatDate={formatDate}
                            showPicker={showStartDatePicker}
                            onDateChange={onStartDateChange}
                            disabled={areDatesDisabled}
                        />

                        <DatePickerField
                            label="Fecha final"
                            value={endDate}
                            onPress={showEndDatepicker}
                            formatDate={formatDate}
                            showPicker={showEndDatePicker}
                            onDateChange={onEndDateChange}
                            disabled={areDatesDisabled}
                        />
                    </View>

                    <CustomDropdown
                        label="Departamento"
                        data={departments}
                        value={department}
                        onValueChange={handleDepartmentChange}
                        placeholder="Departamento"
                        isFocused={departmentFocus}
                        onFocus={() => setDepartmentFocus(true)}
                        onBlur={() => setDepartmentFocus(false)}
                        disabled={isDepartmentDisabled}
                    />

                    <View style={styles.radioContainer}>
                        <TouchableOpacity style={styles.radioOption} onPress={() => setExportFormat('PDF')}>
                            <View style={[styles.radioButton, exportFormat === 'PDF' && styles.radioButtonSelected]}>
                                {exportFormat === 'PDF' && <View style={styles.radioButtonInner} />}
                            </View>
                            <Text style={styles.radioLabel}>PDF</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.radioOption} onPress={() => setExportFormat('Excel')}>
                            <View style={[styles.radioButton, exportFormat === 'Excel' && styles.radioButtonSelected]}>
                                {exportFormat === 'Excel' && <View style={styles.radioButtonInner} />}
                            </View>
                            <Text style={styles.radioLabel}>Excel</Text>
                        </TouchableOpacity>
                    </View>

                    <CustomButton
                        title="Generar reporte"
                        icon="file-download"
                        onPress={handleGenerateReport}
                    />

                    <CustomButton
                        title="Descargar"
                        icon="download"
                        onPress={handleDownload}
                    />
                </View>
            </ScrollView>
            <Footer
                onBackPress={() => router.replace('/')}
                onHomePress={() => router.replace('/main/adminForm')}
            />
        </View>
    );
};

export default ReportesForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        marginBottom: 30,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    radioButton: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#04538A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        borderColor: '#04538A',
    },
    radioButtonInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#04538A',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
    },
    generateButton: {
        backgroundColor: '#04538A',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
    },
    downloadButton: {
        backgroundColor: '#04538A',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        letterSpacing: 1,
    },
});