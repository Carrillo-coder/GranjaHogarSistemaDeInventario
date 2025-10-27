// src/app/entrada/AgregarProductoForm.js
import React, { useState } from 'react';
import {
  SafeAreaView, StatusBar, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Footer from '../../components/Footer';
import { LoteVO } from '../../valueobjects/LoteVO';
import { useEntradaDraft } from '../../hooks/useEntradaDraft';

const AgregarProductoForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { agregarLote } = useEntradaDraft();

  const [cantidad, setCantidad] = useState('');
  const [caducidad, setCaducidad] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const productName = params.productName ?? 'Producto sin nombre';
  const idProducto = params.idProducto ? Number(params.idProducto) : null;

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') { setShowPicker(false); return; }
      setShowPicker(false);
    }
    if (selectedDate) setCaducidad(selectedDate.toISOString().split('T')[0]);
  };

  const validateCantidad = (v) => /^\d+$/.test(v) && Number(v) > 0;

  const handleConfirm = () => {
    if (!idProducto) {
      Alert.alert('Producto inválido', 'Falta el identificador del producto.');
      return;
    }
    if (!validateCantidad(cantidad)) {
      Alert.alert('Cantidad inválida', 'Ingresa un entero mayor a cero.');
      return;
    }

    const base = new LoteVO({
      idProducto,
      nombreProducto: String(productName),
      cantidad: Number(cantidad),
      caducidad: caducidad || null,
    });

    agregarLote(base);
    Alert.alert('Agregado', 'Lote agregado al resumen.');
    router.back(); // volvemos a RegistrarEntradaForm
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Agregar Producto</Text>

        <TextInput style={styles.input} value={String(productName)} editable={false} />

        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          keyboardType="numeric"
          value={cantidad}
          onChangeText={(t) => { if (/^\d*$/.test(t)) setCantidad(t); }}
        />

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)} activeOpacity={0.85}>
          <Ionicons name="calendar-outline" size={20} color="#333" />
          <Text style={styles.dateText}>{caducidad || 'Seleccionar fecha de caducidad (opcional)'}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={caducidad ? new Date(caducidad) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            onTouchCancel={() => setShowPicker(false)}
          />
        )}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

export default AgregarProductoForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 16, marginBottom: 12,
  },
  dateInput: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20,
  },
  dateText: { marginLeft: 10, color: '#333' },
  confirmButton: { backgroundColor: '#8BC34A', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  confirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
