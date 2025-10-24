import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer.js';
import { LoteVO } from '../../valueobjects/LoteVO.js';

const AgregarProductoScreen = ({ productName = 'Producto x' }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cantidad, setCantidad] = useState('');
  const [caducidad, setCaducidad] = useState('');
  const [productNameState, setProductNameState] = useState(params.productName ?? productName);
  const [idProducto, setIdProducto] = useState(params.idProducto ?? '');

  const handleConfirm = () => {
    // Basic validation
    if (!cantidad) return Alert.alert('Validación', 'Ingrese la cantidad');
    if (!caducidad) return Alert.alert('Validación', 'Ingrese la caducidad');

    const lote = new LoteVO({
      idLote: null,
      idProducto: idProducto ? Number(idProducto) : null,
      nombre: productNameState,
      nombreProducto: productNameState,
      cantidad: Number(cantidad),
      caducidad: caducidad,
    });
    console.log('Lote a agregar:', lote);

    // Navigate back with the new lote data
    router.replace({
      pathname: '/entrada/RegistrarEntradaForm',
      params: { lote: JSON.stringify(lote) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card: Producto seleccionado */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Producto seleccionado</Text>
          <Text style={styles.productName}> {productName} </Text>

          {/* Campos */}
          <View style={styles.field}>
            <Text style={styles.label}>Producto:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              placeholderTextColor="#A7A7A7"
              value={productNameState}
              onChangeText={setProductNameState}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>ID Producto:</Text>
            <TextInput
              style={styles.input}
              placeholder="ID (opcional)"
              placeholderTextColor="#A7A7A7"
              value={String(idProducto)}
              onChangeText={setIdProducto}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Cantidad:</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#A7A7A7"
              keyboardType="numeric"
              value={cantidad}
              onChangeText={setCantidad}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Caducidad:</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#A7A7A7"
              value={caducidad}
              onChangeText={setCaducidad}
            />
          </View>
        </View>

        {/* Botón Confirmar */}
        <TouchableOpacity activeOpacity={0.85} style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>

        <Footer
          onLogOutPress={() => router.replace('/')}
          onHomePress={() => router.replace('/main/adminForm')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


export default AgregarProductoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  header: {
    backgroundColor: '#04538A',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#515151',
    marginBottom: 14,
    marginLeft: 2,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 98,
    fontSize: 16,
    color: '#2F2F2F',
    fontWeight: '500',
  },
  input: {
    flexGrow: 1,
    height: 40,
    backgroundColor: '#F3F6F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E8DB',
  },

  confirmButton: {
    marginTop: 8,
    backgroundColor: '#8BC53F', // verde amable tipo mock
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'none',
  },

  bottomBar: {
    marginTop: 24,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 16,
  },
  backPill: {
    alignSelf: 'flex-start',
    marginLeft: 4,
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#7FBF2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoBlock: { alignItems: 'center', gap: 6, marginTop: 8 },
  logoFlowerRow: { flexDirection: 'row', gap: 6 },
  leaf: {
    width: 18,
    height: 18,
    backgroundColor: '#7FBF2A',
    borderRadius: 9,
  },
  logoText: {
    textAlign: 'center',
    color: '#04538A',
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 16,
  },
});