// CatalogoScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const initialProducts = [
  'Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5',
  'Producto 6', 'Producto 7', 'Producto 8', 'Producto 9', 'Producto 10', 'Producto 11'
];

const normalize = (s = '') => s.replace(/\s+/g, '').toLowerCase();

const CatalogoScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [products] = useState(initialProducts);

  // Filtrado: ignora espacios y mayúsculas/minúsculas
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return products;
    return products.filter(p => normalize(p).includes(q));
  }, [query, products]);

  const handlePressProduct = (producto) => {
    // Navega pasando el producto como parámetro
    // Si usas router.navigate('/inventario/DetalleProductoForm') puedes hacerlo desde tu router,
    // aquí usamos react-navigation como ejemplo:
    navigation.navigate('inventario/DetalleProductoForm', { producto });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>catalogo</Text>
      </View>

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

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear producto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="exit-outline" size={28} color="#8BC34A" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/GranjaHogarLogo.png')}
            style={styles.logoImage}
          />
        </View>

        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1976D2', paddingVertical: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  searchContainer: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#aaa', marginBottom: 16 },
  searchInput: { fontSize: 16, textAlign: 'center', color: '#000' },
  productList: { flex: 1, backgroundColor: '#eee', borderRadius: 8, borderWidth: 1, borderColor: '#999', paddingVertical: 8 },
  productItem: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  productText: { fontSize: 16, textAlign: 'center', color: '#333' },
  createButton: { marginTop: 20, backgroundColor: '#1976D2', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#ccc' },
  navButton: { padding: 8 },
  logoWrapper: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, elevation: 2 },
  logoImage: { width: 40, height: 40, resizeMode: 'contain' },
});

export default CatalogoScreen;