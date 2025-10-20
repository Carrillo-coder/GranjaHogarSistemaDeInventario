import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import CustomInput from '../../components/CustomInput';
import DatePickerField from '../../components/DatePickerField';
import CustomButton from '../../components/CustomButton';
import Footer from '../../components/Footer';

const AgregarProductoForm = () => {
  const router = useRouter();
  const [cantidad, setCantidad] = useState('');
  const [caducidad, setCaducidad] = useState(new Date());

  const handleConfirm = () => {
    // Lógica para manejar la confirmación
    console.log('Cantidad:', cantidad);
    console.log('Caducidad:', caducidad);
    router.push('/entrada/RegistrarEntradaForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Agregar producto' }} />
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Producto seleccionado</Text>
          
          <CustomInput
            label="Cantidad:"
            value={cantidad}
            onChangeText={setCantidad}
            placeholder="Ingrese la cantidad"
            keyboardType="numeric"
          />

          <DatePickerField
            label="Caducidad:"
            date={caducidad}
            onDateChange={setCaducidad}
          />

          <CustomButton
            title="Confirmar"
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
        </View>
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
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#8BC34A',
    marginTop: 16,
  },
});

export default AgregarProductoForm;
