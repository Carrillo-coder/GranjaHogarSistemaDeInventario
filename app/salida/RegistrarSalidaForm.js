import 'expo-router/entry';
import { useRouter, router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Text, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EntradaForm = () => {

  const handleBackPress = () => router.back();
  const handleHomePress = () => router.navigate('/');
  const handleCreateProduct = () => {
    console.log('Crear producto');
    router.navigate('/inventario/CrearProductoForm');
  };

  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Arroz', cantidad: 10, tipoSalida: 'Uso', depto: 'Cocina' },
    { id: 2, nombre: 'Frijol', cantidad: 5, tipoSalida: 'Donación', depto: 'Comedor' },
  ]);

  const handleAgregarProducto = () => {
    const nuevo = {
      id: productos.length + 1,
      nombre: `Producto ${productos.length + 1}`,
      cantidad: Math.floor(Math.random() * 10) + 1,
      tipoSalida: 'Uso',
      depto: 'Cocina',
    };
    setProductos([...productos, nuevo]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salida</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Registrar salida</Text>

        <TouchableOpacity style={styles.addButton} onPress={handleCreateProduct}>
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        <View style={styles.resumenBox}>
          <Text style={styles.resumenTitle}>Resumen de salida</Text>
          {productos.length === 0 ? (
            <Text style={styles.placeholder}>No hay productos agregados</Text>
          ) : (
            productos.map((prod) => (
              <View key={prod.id} style={styles.itemBox}>
                <Text style={styles.itemText}>📦 {prod.nombre}</Text>
                <Text style={styles.itemSub}>Cantidad: {prod.cantidad}</Text>
                <Text style={styles.itemSub}>Tipo: {prod.tipoSalida}</Text>
                <Text style={styles.itemSub}>Depto: {prod.depto}</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="exit-outline" size={24} color="#8BC34A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/GranjaHogarLogo.png')}
          style={{ width: 60, height: 60, resizeMode: 'contain' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  resumenBox: {
    width: '100%',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  resumenTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  placeholder: { color: '#999', fontStyle: 'italic' },
  itemBox: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 14, color: '#555' },
  confirmButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: { alignItems: 'center', padding: 8 },
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default EntradaForm;
