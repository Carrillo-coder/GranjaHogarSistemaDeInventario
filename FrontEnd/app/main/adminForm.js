import 'expo-router/entry';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  View, StatusBar, SafeAreaView, ScrollView,
  Text, TouchableOpacity, Pressable, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Estilos/adminFormStyles.styles.js'; 
import Footer from '../../components/Footer.js';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomButton = ({ title, onPress, style, textStyle, icon }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const MainForm = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRolCheck = async () => {
      const rol = await AsyncStorage.getItem("rol");
      if (rol !== "Administrador") {
        console.log("Rol no autorizado, redirigiendo...");
        router.replace('/');
      }
    };

    handleRolCheck();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView style={styles.content}>
        <Pressable style={styles.alert} onPress={() => router.navigate('/alertas/AlertasForm')}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" style={styles.listIcon} />
          <Text style={styles.alertText}>
            Tienes un producto por caducar. <Text style={styles.alertLink}>Pulsa para ver.</Text>
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#b91c1c" />
        </Pressable>

        <View style={styles.row}>
          <CustomButton
            title="Registrar entrada"
            icon="download-outline"
            onPress={() => router.navigate('/entrada/RegistrarEntradaForm')}
            style={[styles.primaryButton, styles.half]}
          />
          <CustomButton
            title="Registrar salida"
            icon="exit-outline"
            onPress={() => router.navigate('/salida/RegistrarSalidaForm')}
            style={[styles.primaryButton, styles.half]}
          />
        </View>

        <CustomButton
          title="Ver inventario"
          icon="cube-outline"
          onPress={() => router.navigate('/inventario/InventarioForm')}
          style={styles.primaryButton}
        />

        <CustomButton
          title="Reportes"
          icon="bar-chart-outline"
          onPress={() => router.navigate('/reportes/ReportesForm')}
          style={styles.primaryButton}
        />

        <CustomButton
          title="Usuarios"
          icon="people-outline"
          onPress={() => router.navigate('/usuarios/UsuariosForm')}
          style={styles.primaryButton}
        />

        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer
        onLogOutPress={  () => router.replace('/')}
        onHomePress={ () => router.replace('/main/adminForm')}
      />

    </SafeAreaView>
  );
};

export default MainForm;