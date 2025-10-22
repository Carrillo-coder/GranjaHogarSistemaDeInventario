import 'expo-router/entry';
import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  Text, StatusBar, Pressable, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import { useSalidas } from '../../hooks/useSalidas';
import useProductosLista from '../../hooks/useProductosLista';

const SalidaForm = () => {
  const router = useRouter();
  const { agregarSalida } = useSalidas(); 

  const { productos, loading, error, reload } = useProductosLista();


  const tiposSalida = [
    { id: 1, name: 'Uso' },
    { id: 2, name: 'Donación' },
    { id: 3, name: 'Venta' },
  ];

  const departamentos = [
    { id: 1, name: 'Cocina' },
    { id: 2, name: 'Comedor' },
  ];

  const [showTipoList, setShowTipoList] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);

  const [showProductoList, setShowProductoList] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [showDeptoList, setShowDeptoList] = useState(false);
  const [selectedDepto, setSelectedDepto] = useState(null);

  const [cantidad, setCantidad] = useState('');
  const [notas, setNotas] = useState('');

  const toggleTipoList = () => setShowTipoList(!showTipoList);
  const toggleProductoList = () => setShowProductoList(!showProductoList);
  const toggleDeptoList = () => setShowDeptoList(!showDeptoList);

  const handleTipoSelect = (tipo) => {
    setSelectedTipo(tipo);
    setShowTipoList(false);
  };

  const handleProductoSelect = (producto) => {
    setSelectedProducto(producto);
    setShowProductoList(false);
  };

  const handleDeptoSelect = (depto) => {
    setSelectedDepto(depto);
    setShowDeptoList(false);
  };

  const handleOnDarsalida = () => {
    if (!selectedProducto || !cantidad || !selectedTipo || !selectedDepto) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const cantidadNum = parseInt(cantidad, 10);

    if (!/^\d+$/.test(cantidad) || cantidadNum <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número entero mayor a cero.');
      return;
    }

    // --- VALIDACIÓN DE STOCK ---
    if (selectedProducto.cantidadTotal < cantidadNum) {
      Alert.alert(
        'Stock Insuficiente',
        `No puedes dar salida a ${cantidadNum} unidades de "${selectedProducto.nombre}".\nStock disponible: ${selectedProducto.cantidadTotal}`
      );
      return;
    }

    agregarSalida({
      id: Date.now(),
      nombre: selectedProducto.nombre,
      cantidad: cantidadNum,
      tipoSalida: selectedTipo.name,
      depto: selectedDepto.name,
      // IDs que usará el backend:
      idProducto: selectedProducto.idProducto,
      idTipo: selectedTipo.id,
      idDepartamento: selectedDepto.id,
      notas: notas,
    });

    Alert.alert('Éxito', 'Producto agregado al resumen de salida.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Detalles salida</Text>

        {/* --- PRODUCTO --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Producto a dar salida</Text>

          {loading && (
            <View style={styles.center}>
              <ActivityIndicator color="#04538A" />
              <Text>Cargando productos...</Text>
            </View>
          )}

          {error && (
            <View style={styles.center}>
              <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
              <TouchableOpacity onPress={reload} style={styles.retryButton}>
                <Text style={{ color: '#fff' }}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && (
            <>
              <TouchableOpacity style={styles.inputBox} onPress={toggleProductoList}>
                <Text style={selectedProducto ? styles.selectedText : styles.placeholderText}>
                  {selectedProducto ? selectedProducto.nombre : 'Selecciona el producto...'}
                </Text>
                <Ionicons
                  name={showProductoList ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>

              {selectedProducto && (
                <Text style={styles.stockText}>
                  Stock disponible: {selectedProducto.cantidadTotal}
                </Text>
              )}

              {showProductoList && (
                <View style={styles.dropdownList}>
                  {productos.map((producto) => (
                    <Pressable
                      key={producto.idProducto}
                      onPress={() => handleProductoSelect(producto)}
                      style={[
                        styles.dropdownItem,
                        selectedProducto?.idProducto === producto.idProducto && styles.selectedItem,
                      ]}
                    >
                      <Text style={styles.itemText}>
                        {producto.nombre} ({producto.presentacion}) - Stock: {producto.cantidadTotal}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </View>


        {/* Cantidad */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cantidad</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Cantidad..."
            value={cantidad}
            onChangeText={(text) => {
              // Permite solo números (y vacío)
              if (/^\d*$/.test(text)) setCantidad(text); 
            }}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>

        {/* Notas */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notas (opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe alguna nota..."
            value={notas}
            onChangeText={setNotas}
            multiline
            numberOfLines={3}
            placeholderTextColor="#666"
          />
        </View>

        {/* Tipo */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tipo de salida</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleTipoList}>
            <Text style={selectedTipo ? styles.selectedText : styles.placeholderText}>
              {selectedTipo ? selectedTipo.name : 'Selecciona tipo...'}
            </Text>
            <Ionicons name={showTipoList ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
          </TouchableOpacity>
          {showTipoList && (
            <View style={styles.dropdownList}>
              {tiposSalida.map((tipo) => (
                <Pressable
                  key={tipo.id}
                  onPress={() => handleTipoSelect(tipo)}
                  style={[styles.dropdownItem, selectedTipo?.id === tipo.id && styles.selectedItem]}
                >
                  <Text style={styles.itemText}>{tipo.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Departamento */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Departamento</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleDeptoList}>
            <Text style={selectedDepto ? styles.selectedText : styles.placeholderText}>
              {selectedDepto ? selectedDepto.name : 'Selecciona departamento...'}
            </Text>
            <Ionicons name={showDeptoList ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
          </TouchableOpacity>
          {showDeptoList && (
            <View style={styles.dropdownList}>
              {departamentos.map((depto) => (
                <Pressable
                  key={depto.id}
                  onPress={() => handleDeptoSelect(depto)}
                  style={[styles.dropdownItem, selectedDepto?.id === depto.id && styles.selectedItem]}
                >
                  <Text style={styles.itemText}>{depto.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleOnDarsalida}>
          <Text style={styles.submitButtonText}>Dar salida</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer onLogOutPress={() => router.replace('/')} onHomePress={() => router.replace('/main/adminForm')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16, paddingBottom: 150 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, marginBottom: 6, fontWeight: '500', color: '#333' },
  textInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  inputBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#fff' },
  selectedText: { fontSize: 16, color: '#000' },
  placeholderText: { fontSize: 16, color: '#999' },
  dropdownList: { borderWidth: 1, borderColor: '#ccc', borderTopWidth: 0, borderRadius: 8, overflow: 'hidden', marginTop: 2, backgroundColor: '#fff' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 12 },
  selectedItem: { backgroundColor: '#e0f2f1' },
  itemText: { fontSize: 16 },
  submitButton: { backgroundColor: '#8BC34A', paddingVertical: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  stockText: { marginTop: 8, fontSize: 14, color: '#04538A', fontWeight: '600', textAlign: 'right' },
});

export default SalidaForm;