import 'expo-router/entry';
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text, StatusBar, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import { CustomDropdown } from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';

const SalidaForm = () => {
  const router = useRouter();

  const handleOnDarsalida = () => {
    Alert.alert('Salida registrada con éxito');
    console.log('Producto agregado a la salida');
    router.back();
  };

  const tiposSalida = [
    { label: 'Uso', value: 'Uso' },
    { label: 'Donación', value: 'Donación' },
    { label: 'Venta', value: 'Venta' },
  ];

  const productos = [
    { label: 'Arroz', value: 'Arroz' },
    { label: 'Frijoles', value: 'Frijoles' },
    { label: 'Aceite', value: 'Aceite' },
  ];

  const departamentos = [
    { label: 'Cocina', value: 'Cocina' },
    { label: 'Comedor', value: 'Comedor' },
  ];

  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedDepto, setSelectedDepto] = useState(null);
  const [cantidad, setCantidad] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Detalles salida</Text>

        <CustomDropdown
          label="Producto a dar salida"
          data={productos}
          value={selectedProducto}
          onValueChange={setSelectedProducto}
          onBlur={() => {}}
          placeholder="Selecciona el producto..."
        />

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

        <CustomDropdown
          label="Tipo de salida"
          data={tiposSalida}
          value={selectedTipo}
          onValueChange={setSelectedTipo}
          onBlur={() => {}}
          placeholder="Selecciona tipo..."
        />

        <CustomDropdown
          label="Departamento"
          data={departamentos}
          value={selectedDepto}
          onValueChange={setSelectedDepto}
          onBlur={() => {}}
          placeholder="Selecciona departamento..."
        />

        <CustomButton
          title="Dar salida"
          onPress={handleOnDarsalida}
          style={styles.confirmButton}
        />

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
  confirmButton: {
    backgroundColor: '#8BC34A',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
});

export default SalidaForm;
