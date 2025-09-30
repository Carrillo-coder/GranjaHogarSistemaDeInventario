import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper'; 
import { router } from 'expo-router'; 

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = () => {
    if (usuario && contrasena) {
      Alert.alert('Inicio de Sesión Exitoso', 'Redirigiendo a la pantalla principal...');
      
      if (usuario === 'admin') {
        router.replace('/main/adminForm');
      } else if (usuario === 'cocina') {
        router.replace('/main/CocinaForm');
      } else if (usuario === 'comedor') {
        router.replace('/main/ComedorForm'); 
      }
    } else {
      Alert.alert('Error', 'Por favor, introduce tu usuario y contraseña.');
    }
  };


  return (
    <PaperProvider>
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/GranjaHogarLogo.png')} // ⬅️ Revisa tu ruta
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
            mode="outlined" // Puedes usar 'flat' o 'outlined'
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
            mode="contained" // Fondo sólido
            onPress={handleLogin}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="arrow-right-bold-box" 
          >
            Iniciar sesión
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
