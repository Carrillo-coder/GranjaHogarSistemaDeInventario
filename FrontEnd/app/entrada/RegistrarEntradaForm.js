// src/app/entrada/RegistrarEntradaForm.js
import 'expo-router/entry';
import React, { useState } from 'react';
import {
  View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text,
  TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEntradaDraft } from '../../hooks/useEntradaDraft';

const RegistrarEntradaForm = () => {
  const router = useRouter();
  const { lotes, confirming, syncLotes, removerLote, confirmarEntrada } = useEntradaDraft();

  const [proveedor, setProveedor] = useState('');
  const [notas, setNotas] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Igual que en Salidas: sincroniza al tomar foco
  useFocusEffect(
    React.useCallback(() => { syncLotes(); }, [syncLotes])
  );

  const handleAgregarProducto = () => {
    // Tu flujo para elegir producto; luego navegas a AgregarProductoForm
    router.navigate('/inventario/InventarioForm?context=entrada');
  };

  const handleConfirmPress = () => {
    if (lotes.length === 0) return Alert.alert('Agrega al menos un lote antes de confirmar');
    if (!proveedor.trim()) return Alert.alert('El proveedor es obligatorio');
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    const ok = await confirmarEntrada({ proveedor, notas });
    if (ok) {
      Alert.alert('Éxito', 'Entrada registrada correctamente');
      setProveedor('');
      setNotas('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Registrar Entrada</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAgregarProducto}
          disabled={confirming}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        {lotes.length === 0 ? (
          <Text style={{ color: '#777', textAlign: 'center', marginBottom: 8 }}>
            No hay lotes agregados aún
          </Text>
        ) : null}

        {lotes.map((lote) => (
          <View key={lote.__tmpId} style={styles.loteBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.loteText}>{lote.nombreProducto}</Text>
              <Text style={styles.subText}>Cantidad: {lote.cantidad}</Text>
              <Text style={styles.subText}>Caducidad: {lote.caducidad || '—'}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removerLote(lote.__tmpId)}
              activeOpacity={0.85}
            >
              <Text style={styles.removeBtnText}>Quitar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proveedor:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del proveedor"
            value={proveedor}
            onChangeText={setProveedor}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas:</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Notas adicionales..."
            value={notas}
            onChangeText={setNotas}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, (confirming || lotes.length === 0) && { opacity: 0.6 }]}
          onPress={handleConfirmPress}
          disabled={confirming || lotes.length === 0}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="white" />
          <Text style={styles.confirmButtonText}>
            {confirming ? 'Enviando...' : 'Confirmar Entrada'}
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>¿Confirmar envío de entrada?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancel]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.confirm]}
                  onPress={handleConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <Footer onLogOutPress={() => router.replace('/')} onHomePress={() => router.replace('/main/adminForm')} />
    </SafeAreaView>
  );
};

export default RegistrarEntradaForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },

  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#04538A', paddingVertical: 12, borderRadius: 8, marginBottom: 16,
  },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  loteBox: {
    flexDirection: 'row',
    backgroundColor: '#fff', padding: 12, borderRadius: 8,
    marginBottom: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  loteText: { fontWeight: 'bold', fontSize: 16 },
  subText: { color: '#555', fontSize: 14 },

  removeBtn: { backgroundColor: '#D32F2F', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginLeft: 8 },
  removeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  inputGroup: { marginTop: 12, marginBottom: 8 },
  label: { marginBottom: 6, fontWeight: '500', color: '#333' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
  },
  multiline: { height: 70, textAlignVertical: 'top' },

  confirmButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#8BC34A', paddingVertical: 14, borderRadius: 10, marginTop: 12,
  },
  confirmButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },

  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%' },
  modalText: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalBtn: { flex: 1, marginHorizontal: 8, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  confirm: { backgroundColor: '#04538A' },
  cancel: { backgroundColor: '#D32F2F' },
  modalBtnText: { color: '#fff', fontWeight: 'bold' },
});
