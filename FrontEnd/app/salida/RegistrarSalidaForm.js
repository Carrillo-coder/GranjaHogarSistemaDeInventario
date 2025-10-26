import 'expo-router/entry';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, StatusBar, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Footer from '../../components/Footer';
import { useSalidas } from '../../hooks/useSalidas';

const RegistrarSalidaForm = () => {
  const router = useRouter();
  const { salidas, confirmarSalidas, syncSalidas, removerSalida, confirming } = useSalidas();

  useFocusEffect(
    React.useCallback(() => { syncSalidas(); }, [syncSalidas])
  );

  const handleConfirmarSalida = async () => {
    if (salidas.length === 0) {
      Alert.alert('No hay salidas para confirmar');
      return;
    }
    const ok = await confirmarSalidas();
    if (ok) Alert.alert('Éxito', 'Salidas confirmadas y enviadas a la base de datos');
  };

  const handleAgregarSalida = () => router.navigate('/salida/SalidaForm');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Registrar Salida</Text>

        <TouchableOpacity style={styles.addButton} onPress={handleAgregarSalida}>
          <Text style={styles.addButtonText}>Agregar Salida</Text>
        </TouchableOpacity>

        <View style={styles.resumenBox}>
          <Text style={styles.resumenTitle}>Resumen de salida</Text>

          {salidas.length === 0 ? (
            <Text style={styles.placeholder}>No hay productos agregados</Text>
          ) : (
            salidas.map((s) => (
              <View key={s.id} style={styles.itemBox}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{s.nombre}</Text>
                  <Text style={styles.itemSub}>Cantidad: {s.cantidad}</Text>
                  <Text style={styles.itemSub}>Tipo: {s.tipoNombre}</Text>
                  <Text style={styles.itemSub}>Depto: {s.deptoNombre}</Text>
                  {!!s.notas && <Text style={styles.itemSub}>Notas: {s.notas}</Text>}
                </View>
                <TouchableOpacity onPress={() => removerSalida(s.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, (confirming || salidas.length === 0) && { opacity: 0.6 }]}
          onPress={handleConfirmarSalida}
          disabled={confirming || salidas.length === 0}
        >
          <Text style={styles.confirmButtonText}>{confirming ? 'Enviando...' : 'Confirmar'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer onLogOutPress={() => router.replace('/')} onHomePress={() => router.replace('/main/adminForm')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flexGrow: 1, padding: 16, paddingBottom: 120, alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12, textAlign: 'center' },
  addButton: { backgroundColor: '#04538A', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, marginBottom: 20 },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  resumenBox: { width: '100%', minHeight: 200, borderWidth: 1, borderColor: '#aaa', borderRadius: 6, padding: 12, marginBottom: 20, backgroundColor: '#fff' },
  resumenTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  placeholder: { color: '#999', fontStyle: 'italic' },

  itemBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 6 },
  itemContent: { flex: 1 },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 14, color: '#555' },
  removeButton: { backgroundColor: '#D32F2F', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5, marginLeft: 8 },
  removeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  confirmButton: { backgroundColor: '#8BC34A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: '100%' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default RegistrarSalidaForm;
