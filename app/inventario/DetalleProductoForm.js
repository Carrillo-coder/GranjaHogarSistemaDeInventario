import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetalleProductoForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const producto = route.params?.producto ?? 'Manzana';

  // Datos de ejemplo (puedes reemplazarlos con datos reales cuando lleguen desde BD)
  const datos = {
    Producto: producto,
    Presentacion: 'Unidades',
    Categoria: 'Bolsas de 10',
    'Cantidad Existente': '23',
    'Fecha de Caducidad': '21/09/2025',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DETALLES DEL PRODUCTO</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.table}>
          {Object.entries(datos).map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <View style={styles.cellLabel}>
                <Text style={styles.labelText}>{label}</Text>
              </View>
              <View style={styles.cellValue}>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => { /* estético por ahora */ }}>
          <Text style={styles.editButtonText}>Editar Información</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1976D2', paddingVertical: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  body: { padding: 16, paddingBottom: 40 },
  table: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  row: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 12, backgroundColor: '#eee', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  cellLabel: { flex: 1, justifyContent: 'center' },
  cellValue: { flex: 1, justifyContent: 'center' },
  labelText: { fontWeight: 'bold', fontSize: 15 },
  valueText: { fontSize: 15 },
  editButton: { marginTop: 24, backgroundColor: '#1976D2', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  editButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default DetalleProductoForm;