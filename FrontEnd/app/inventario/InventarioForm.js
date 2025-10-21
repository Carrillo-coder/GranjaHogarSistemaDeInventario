import React, { useMemo, useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SafeAreaView, 
  ScrollView, TouchableOpacity, StatusBar, ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import Footer from '../../components/Footer';
import useProductosLista from '../../hooks/useProductosLista';

const normalize = (s = '') => s.replace(/\s+/g, '').toLowerCase();

const CatalogoScreen = () => {
  const { productos, loading, error, reload } = useProductosLista();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return productos;
    return productos.filter(p => normalize(p.nombre).includes(q));
  }, [query, productos]);

  const handlePressProduct = (producto) => {
    router.navigate({
      pathname: 'inventario/DetalleProductoForm',
      params: { idProducto: producto.idProducto }, // 👈 aquí pasamos el ID
    });
  };

  const handleCreateProduct = () => {
    router.navigate('/inventario/CrearProductoForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar producto"
            placeholderTextColor="#000"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#04538A" />
            <Text>Cargando productos...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity onPress={reload} style={styles.retryButton}>
              <Text style={{ color: '#fff' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <ScrollView style={styles.productList}>
            {filtered.map((producto) => (
              <TouchableOpacity key={producto.idProducto} onPress={() => handlePressProduct(producto)}>
                <View style={styles.productItem}>
                  <Text style={styles.productText}>{producto.nombre}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {filtered.length === 0 && (
              <View style={[styles.productItem, { justifyContent: 'center' }]}>
                <Text style={[styles.productText, { color: '#777' }]}>No se encontraron productos</Text>
              </View>
            )}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateProduct}>
          <Text style={styles.createButtonText}>Crear producto</Text>
        </TouchableOpacity>
      </View>

      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  searchContainer: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#aaa', marginBottom: 16 },
  searchInput: { fontSize: 16, textAlign: 'center', color: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  productList: { flex: 1, backgroundColor: '#eee', borderRadius: 8, borderWidth: 1, borderColor: '#999', paddingVertical: 8 },
  productItem: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  productText: { fontSize: 16, textAlign: 'center', color: '#333' },
  createButton: { marginTop: 20, backgroundColor: '#04538A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  retryButton: { backgroundColor: '#04538A', padding: 10, borderRadius: 8 },
});

export default CatalogoScreen;
