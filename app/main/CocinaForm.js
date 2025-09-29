import 'expo-router/entry';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View, StyleSheet, StatusBar, SafeAreaView, ScrollView,
  Text, TouchableOpacity, Pressable, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomButton = ({ title, onPress, style, textStyle, icon }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const MainForm = () => {
  const router = useRouter();

  const handleBackPress = () => router.back();
  const handleHomePress = () => router.navigate('/index');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cocina</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Alerta superior que navega a Alertas */}
        <Pressable style={styles.alert} onPress={() => router.navigate('/alertas/AlertasForm')}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" style={styles.listIcon} />
          <Text style={styles.alertText}>
            Tienes un producto por caducar. <Text style={styles.alertLink}>Pulsa para ver.</Text>
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#b91c1c" />
        </Pressable>

        {/* Acciones principales */}
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

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#8BC34A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require('../../assets/images/GranjaHogarLogo.png')}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // layout
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#1976D2', paddingVertical: 15, paddingHorizontal: 20,
    elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  content: { flex: 1, padding: 16 },

  // alert card
  alert: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca',
    padding: 12, borderRadius: 8, marginBottom: 16,
  },
  listIcon: { marginRight: 8 },
  alertText: { flex: 1, fontSize: 14, color: '#7f1d1d' },
  alertLink: { textDecorationLine: 'underline', fontWeight: '600' },

  // buttons
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  half: { flex: 1 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8,
    elevation: 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#1976D2', marginBottom: 12 },

  // bottom nav
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white',
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0',
    elevation: 8, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  navButton: { alignItems: 'center', padding: 8 },

  // logo
  logoContainer: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  logoPlaceholder: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
    elevation: 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
  },
});

export default MainForm;
