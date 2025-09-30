// CatalogoScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import Footer from '../../components/Footer';

const initialProducts = [
  'Arroz', 'Frijoles', 'Leche', 'Huevos', 'Queso',
  'Pollo', 'Carne de res', 'Aceite de cocina', 'Azúcar', 'Sal', 'Café'
];

const handleConfirmarActualizacion = () => {
  Alert.alert('Producto actualizado con exito');  
  console.log('Producto actualizado en la BD...')
  router.back();
}

const normalize = (s = '') => s.replace(/\s+/g, '').toLowerCase();

const CatalogoScreen = () => {
  const [query, setQuery] = useState('');
  const [products] = useState(initialProducts);


  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return products;
    return products.filter(p => normalize(p).includes(q));
  }, [query, products]);

  const handlePressProduct = (producto) => {
    router.navigate('inventario/DetalleProductoForm', { producto });
  };

  const handleCreateProduct = () => {
    console.log('Crear producto');
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
            returnKeyType="search"
          />
        </View>

        <ScrollView style={styles.productList}>
          {filtered.map((producto, index) => (
            <TouchableOpacity key={index} onPress={() => handlePressProduct(producto)}>
              <View style={styles.productItem}>
                <Text style={styles.productText}>{producto}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {filtered.length === 0 && (
            <View style={[styles.productItem, { justifyContent: 'center' }]}>
              <Text style={[styles.productText, { color: '#777' }]}>No se encontraron productos</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.createButton} 
        onPress={handleCreateProduct}>
          <Text style={styles.createButtonText}>Crear producto</Text>
        </TouchableOpacity>
      </View>
      <Footer
        onLogOutPress={  () => router.replace('/')}
        onHomePress={ () => router.replace('/main/adminForm')} 
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  searchContainer: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#aaa', marginBottom: 16 },
  searchInput: { fontSize: 16, textAlign: 'center', color: '#000' },
  productList: { flex: 1, backgroundColor: '#eee', borderRadius: 8, borderWidth: 1, borderColor: '#999', paddingVertical: 8 },
  productItem: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  productText: { fontSize: 16, textAlign: 'center', color: '#333' },
  createButton: { marginTop: 20, backgroundColor: '#04538A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#ccc' },
  navButton: { padding: 8 },
  logoWrapper: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, elevation: 2 },
  logoImage: { width: 40, height: 40, resizeMode: 'contain' },
});

export default CatalogoScreen;

