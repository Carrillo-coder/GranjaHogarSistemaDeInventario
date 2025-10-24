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


  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Comprobando sesión almacenada en AsyncStorage');
        const userToken = await AsyncStorage.getItem('userToken');
        const rol = await AsyncStorage.getItem('rol');

        if (userToken && rol) {
          Alert.alert('Inicio de Sesión Automático', `Bienvenido de nuevo, ${rol}.`);
          if (rol === 'Administrador') {
            router.replace('/main/adminForm');
          } else if (rol === 'Cocina') {
            router.replace('/main/CocinaForm');
          } else if (rol === 'Comedor') {
            router.replace('/main/ComedorForm');
          }
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo recuperar la sesión.');
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (data && data.message === 'Inicio de sesión exitoso' && data.token && data.data.rol) {
        try {
          await AsyncStorage.setItem('userToken', data.token);
          await AsyncStorage.setItem('rol', data.data.rol);
          await AsyncStorage.setItem('nombreCompleto', data.data.nombreCompleto);
          await AsyncStorage.setItem('idUsuario', data.data.id.toString());
          console.log(data);
          Alert.alert('Inicio de Sesión Exitoso', `Bienvenido, ${data.data.rol}.`);

          if (data.data.rol === 'Administrador') {
            router.replace('/main/adminForm');
          } else if (data.data.rol === 'Cocina') {
            router.replace('/main/CocinaForm');
          } else if (data.data.rol === 'Comedor') {
            router.replace('/main/ComedorForm');
          } else {
            Alert.alert('Error de Rol', 'No tienes un rol asignado para acceder.');
          }
        } catch (e) {
          Alert.alert('Error', 'No se pudo guardar la sesión.');
        }
      }
    };

    handleLoginSuccess();
  }, [data]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error de Inicio de Sesión', error);
    }
  }, [error]);

  const handleLogin = () => {
    if (usuario && contrasena) {
      logIn(usuario, contrasena);
      
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
