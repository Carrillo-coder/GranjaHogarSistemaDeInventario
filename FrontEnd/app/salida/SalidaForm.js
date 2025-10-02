import 'expo-router/entry';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Text, StatusBar, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Footer from '../../components/Footer';



const SalidaForm = () => {
  const router = useRouter();

  const handleOnDarsalida = () => {
  Alert.alert('Salida registrada con exito');  
  console.log('Producto agregado a la salida')
  router.back();
  }

  // Opciones de ejemplo
  const tiposSalida = [
    { id: 1, name: 'Uso' },
    { id: 2, name: 'Donación' },
    { id: 3, name: 'Venta' },
  ];

  const productos = [
    { id: 1, name: 'Arroz' },
    { id: 2, name: 'Frijoles' },
    { id: 3, name: 'Aceite' },
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Detalles salida</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Producto a dar salida</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleProductoList}>
            <Text style={selectedProducto ? styles.selectedText : styles.placeholderText}>
              {selectedProducto ? selectedProducto.name : 'Selecciona el producto...'}
            </Text>
            <Ionicons name={showProductoList ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#000" />
          </TouchableOpacity>
          {showProductoList && (
            <View style={styles.dropdownList}>
              {productos.map((producto) => (
                <Pressable
                  key={producto.id}
                  onPress={() => handleProductoSelect(producto)}
                  style={[styles.dropdownItem, selectedProducto?.id === producto.id && styles.selectedItem]}
                >
                  <Text style={styles.itemText}>{producto.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ingresa la cantidad usada</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Cantidad..."
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tipo de salida</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleTipoList}>
            <Text style={selectedTipo ? styles.selectedText : styles.placeholderText}>
              {selectedTipo ? selectedTipo.name : 'Selecciona tipo...'}
            </Text>
            <Ionicons name={showTipoList ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#000" />
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Departamento</Text>
          <TouchableOpacity style={styles.inputBox} onPress={toggleDeptoList}>
            <Text style={selectedDepto ? styles.selectedText : styles.placeholderText}>
              {selectedDepto ? selectedDepto.name : 'Selecciona departamento...'}
            </Text>
            <Ionicons name={showDeptoList ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#000" />
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
      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#04538A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 150,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },

  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 2,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  selectedItem: {
    backgroundColor: '#e0f2f1',
  },
  itemText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  logoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default SalidaForm;