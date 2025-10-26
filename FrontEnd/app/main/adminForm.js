import 'expo-router/entry';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  View, StatusBar, SafeAreaView, ScrollView,
  Text, TouchableOpacity, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Estilos/adminFormStyles.styles.js';
import Footer from '../../components/Footer.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAlertas from '../../hooks/useAlertas';

const CustomButton = ({ title, onPress, style, textStyle, icon }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

function buildAlertText(expiringCount, lowCount, overCount) {
  const parts = [];
  if (expiringCount > 0) parts.push(expiringCount === 1 ? '1 producto por caducar' : `${expiringCount} productos por caducar`);
  if (lowCount > 0) parts.push(lowCount === 1 ? '1 producto bajo en stock' : `${lowCount} productos bajos en stock`);
  if (overCount > 0) parts.push(overCount === 1 ? '1 producto alto en inventario' : `${overCount} productos altos en inventario`);
  if (parts.length === 0) return '';
  if (parts.length === 1) return `Tienes ${parts[0]}. Pulsa para ver.`;
  if (parts.length === 2) return `Tienes ${parts[0]} y ${parts[1]}. Pulsa para ver.`;
  return `Tienes ${parts[0]}, ${parts[1]} y ${parts[2]}. Pulsa para ver.`;
}

const MainForm = () => {
  const router = useRouter();

  // Proteger por rol
  useFocusEffect(
    useCallback(() => {
      const handleRolCheck = async () => {
        const rol = await AsyncStorage.getItem("rol");
        if (rol !== "Administrador") {
          console.log("Rol no autorizado, redirigiendo...");
          router.replace('/');
        }
      };
      handleRolCheck();
    }, [router])
  );

  // Alertas dinámicas
  const alertasOpts = useMemo(() => ({ dias: 10, umbralBajo: 10, umbralAlto: 100 }), []);
  const { expiring, lowStock, overStock } = useAlertas(alertasOpts);
  const total = expiring.length + lowStock.length + overStock.length;
  const alertText = buildAlertText(expiring.length, lowStock.length, overStock.length);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView style={styles.content}>
        {/* Alerta dinámica: solo se muestra si hay algo */}
        {total > 0 && (
          <Pressable style={styles.alert} onPress={() => router.navigate('/alertas/AlertasForm')}>
            <Ionicons name="alert-circle" size={20} color="#b91c1c" style={styles.listIcon} />
            <Text style={styles.alertText}>
              {alertText}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#b91c1c" />
          </Pressable>
        )}

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
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

export default MainForm;
