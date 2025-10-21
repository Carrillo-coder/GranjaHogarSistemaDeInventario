import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Footer from '../../components/Footer';
import useProductoDetalle from '../../hooks/useProductoDetalles';

const DetalleProductoForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Recibimos el ID del producto desde la navegación
  const idProducto = params?.idProducto 
    ? parseInt(params.idProducto) 
    : null;

  // Hook personalizado para cargar los datos
  const { producto, loading, error, reload } = useProductoDetalle(idProducto);

  const handleConfirmarActualizacion = () => {
    Alert.alert('Producto actualizado con éxito');
    console.log('Producto actualizado en la BD...');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.body}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#04538A" />
            <Text style={{ marginTop: 10 }}>Cargando información...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
              ⚠️ {error}
            </Text>
            <TouchableOpacity onPress={reload} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && producto && (
          <>
            <View style={styles.table}>
              {[
                ['Producto', producto.nombre],
                ['Presentación', producto.presentacion],
                ['Categoría', producto.categoria?.nombre ?? 'Sin categoría'],
                ['Cantidad Existente', producto.cantidadTotal?.toString() ?? '0'],
                ['Fecha de Caducidad', producto.caducidadProxima ?? '—'],
              ].map(([label, value], idx) => (
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

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleConfirmarActualizacion}
            >
              <Text style={styles.editButtonText}>Volver al Catálogo</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 16, paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 50 },
  table: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  row: { 
    flexDirection: 'row', 
    paddingVertical: 14, 
    paddingHorizontal: 12, 
    backgroundColor: '#eee', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' 
  },
  cellLabel: { flex: 1, justifyContent: 'center' },
  cellValue: { flex: 1, justifyContent: 'center' },
  labelText: { fontWeight: 'bold', fontSize: 15 },
  valueText: { fontSize: 15 },
  editButton: { 
    marginTop: 24, 
    backgroundColor: '#04538A', 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  editButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  retryButton: { backgroundColor: '#04538A', padding: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
});

export default DetalleProductoForm;
