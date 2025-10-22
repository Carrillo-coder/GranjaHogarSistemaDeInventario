import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogIn from '../hooks/useLogIn';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  // Correctly destructure what the hook returns
  const { logIn, loading, error, data } = useLogIn();

  // Effect to handle successful login
  useEffect(() => {
    // Check if data exists and login was successful
    console.log('Intentando entrar al useEffect de data');
    const rol = AsyncStorage.getItem('rol');
    console.log('Rol obtenido de AsyncStorage:', rol, !rol);
    if (rol && rol.not==null) {
      console.log('Entrando al useEffect de data');
      const Navigate = async () => {
        try {
          Alert.alert('Inicio de Sesión Exitoso', `Bienvenido, ${rol}.`);

          // Navigate based on the role from the API response
          if (rol === 'Admin') {
            router.replace('/main/adminForm');
          } else if (rol === 'Cocina') {
            router.replace('/main/CocinaForm');
          } else if (rol === 'Comedor') {
            router.replace('/main/ComedorForm');
          } else {
             Alert.alert('Error de Rol', 'No tienes un rol asignado para acceder.');
          }

        } catch (e) {
          Alert.alert('Error', 'No se pudo guardar la sesión.');
        }
      };

      Navigate();
    }
  }, [data]); // This effect runs when the 'data' object changes

  // Effect to handle login errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error de Inicio de Sesión', error);
    }
  }, [error]); // This effect runs when the 'error' object changes

  // Simplified handler, just triggers the login
  const handleLogin = () => {
    if (usuario && contrasena) {
      logIn(usuario, contrasena);
      Alert.alert('Login', 'Iniciando sesión...');
      console.log('datos obtenidos', data, data.data.rol)
      if (data.message === 'Inicio de sesión exitoso' && data.token && data.data.rol) {
        console.log('store credentials', 'guardando datos...');
        AsyncStorage.setItem('userToken', data.token);
        AsyncStorage.setItem('rol', data.data.rol);
      }
    } else {
      Alert.alert('Campos incompletos', 'Por favor, introduce tu usuario y contraseña.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/GranjaHogarLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>GRANJA HOGAR</Text>
        </View>
        
        <View style={styles.formContainer}>
          
          <TextInput
            label="Usuario"
            value={usuario}
            onChangeText={setUsuario}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="arrow-right-bold-box" 
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </Button>
          
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.footerText}>Tecnológico de Monterrey</Text>
          <Text style={styles.footerText}>©ITESM 2025</Text>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 50, 
  },
  
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 150, 
    height: 150, 
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#04538A', 
    marginBottom: 50,
  },
  
  formContainer: {
    width: '100%',
    alignItems: 'center',
    maxWidth: 400,
  },
  input: {
    width: '90%',
    marginBottom: 25, 
    backgroundColor: '#fff',
  },
  
  button: {
    width: '60%',
    height: 55,
    borderRadius: 30, 
    marginTop: 20,
    justifyContent: 'center', 
    backgroundColor: '#04538A', 
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  footer: {
    alignItems: 'center',
    marginTop: 'auto', 
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
});
