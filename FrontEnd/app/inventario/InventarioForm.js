import React, { useMemo, useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SafeAreaView, 
  ScrollView, TouchableOpacity, StatusBar, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Footer from '../../components/Footer';
import useProductosLista from '../../hooks/useProductosLista';

// 🔎 Normaliza acentos y espacios para la búsqueda
const normalize = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

const InventarioForm = () => {
  const { productos, loading, error, reload } = useProductosLista();
  const [query, setQuery] = useState('');

  // Filtro por nombre o presentación
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return productos;
    return productos.filter(p => {
      const n = normalize(String(p?.nombre ?? ''));
      const pr = normalize(String(p?.presentacion ?? ''));
      return n.includes(q) || pr.includes(q);
    });
  }, [query, productos]);

  const handlePressProduct = (producto) => {
    router.navigate({
      pathname: 'inventario/DetalleProductoForm',
      params: { idProducto: producto.idProducto },
    });
  };

  const handleCreateProduct = () => {
    router.navigate('/inventario/CrearProductoForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <View style={styles.content}>
        {/* 🔍 Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Buscar por nombre o presentación"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* 🔄 Estado de carga o error */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#04538A" />
            <Text style={{ marginTop: 8, color: '#333' }}>Cargando productos...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
            <TouchableOpacity onPress={reload} style={styles.retryButton}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 📦 Lista de productos */}
        {!loading && !error && (
          <ScrollView style={styles.productList} contentContainerStyle={{ paddingVertical: 4 }}>
            {filtered.map((producto) => (
              <TouchableOpacity
                key={producto.idProducto}
                onPress={() => handlePressProduct(producto)}
                activeOpacity={0.7}
              >
                <View style={styles.productItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {producto.nombre}
                    </Text>
                    <Text style={styles.productPresentation} numberOfLines={2} ellipsizeMode="tail">
                      {producto.presentacion || 'Sin presentación'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#bbb" />
                </View>
              </TouchableOpacity>
            ))}

            {filtered.length === 0 && (
              <View style={styles.emptyBox}>
                <Ionicons name="information-circle-outline" size={18} color="#777" style={{ marginRight: 6 }} />
                <Text style={styles.emptyText}>No se encontraron productos</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* ➕ Crear nuevo producto */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateProduct} activeOpacity={0.85}>
          <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
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

  // 🔍 Buscador
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 15.5, color: '#111' },
  clearBtn: { padding: 4, marginLeft: 4 },

  // 💬 Estados
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },

  // 📋 Lista
  productList: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productName: { fontSize: 16, color: '#1f2937', fontWeight: '600' },
  productPresentation: { marginTop: 2, fontSize: 12.5, color: '#6b7280', lineHeight: 16.5 },

  // 🧾 Sin resultados
  emptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: { color: '#777', fontSize: 14 },

  // ➕ Botón crear
  createButton: {
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: '#04538A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // 🔁 Botón reintentar
  retryButton: { backgroundColor: '#04538A', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
});

export default InventarioForm;
