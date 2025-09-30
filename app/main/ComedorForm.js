import 'expo-router/entry';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View, StatusBar, SafeAreaView, ScrollView,
  Text, TouchableOpacity, Pressable, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Estilos/ComedorFormStyles.styles.js';

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
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comedor</Text>
      </View>

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
        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#8BC34A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

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

export default MainForm;